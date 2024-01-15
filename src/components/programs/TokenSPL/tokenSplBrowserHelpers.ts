import { AnchorProvider, Provider } from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  mintTo,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
  Account,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createAssociatedTokenAccountInstruction,
  TokenInvalidMintError,
  TokenInvalidOwnerError,
  createMintToInstruction,
  createTransferInstruction,
  unpackAccount,
  createBurnInstruction,
} from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  type Connection,
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
  Commitment,
  ConfirmOptions
} from "@solana/web3.js";
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { confirmTransaction } from "../../../solana/helpers";

/**
 * I haven't found anything easier than manual transaction generation 
 * based on `@solana/spl-token` functions
 */


/**
 * Based on @solana/spl-token `createMint` function
 */
export async function createMint(
  connection: Connection,
  wallet: WalletContextState,
  decimals = 9,
) {
  if (!wallet || !wallet.publicKey) throw new WalletNotConnectedError();

  // generating random account keypair, that will store global token data
  const mint = Keypair.generate();

  // setting both authorities to current wallet
  const mintAuthority = wallet.publicKey;
  const freezeAuthority = wallet.publicKey;

  // getting minimum abount of SOL that is required to fund mint account
  const lamports = await getMinimumBalanceForRentExemptMint(connection);

  // generating transaction instructions
  const transaction = new Transaction().add(
    // 1st instruction - creating and funding account to store global token data
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    // 2nd instruction - initializing created account with token program
    createInitializeMint2Instruction(
      mint.publicKey,   // address of account that will store global token data
      decimals,
      mintAuthority,
      freezeAuthority,
      TOKEN_PROGRAM_ID
    )
  );

  // sending instructions to
  const signature = await wallet.sendTransaction(
    transaction,
    connection,
    { signers: [mint] } // proving that we owe mint account
  );
  await confirmTransaction(connection, signature);

  return mint.publicKey;
}

/**
 * Based on @solana/spl-token `mintTo` function
 */
export async function getOrCreateAssociatedTokenAccount(
  connection: Connection,
  wallet: WalletContextState,
  mint: PublicKey,
  owner: PublicKey,
  commitment?: Commitment,
) {
  if (!wallet || !wallet.publicKey) throw new WalletNotConnectedError();
  const programId = TOKEN_PROGRAM_ID;
  const associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID;

  const associatedToken = getAssociatedTokenAddressSync(
    mint,
    owner,
    false,  // allowOwnerOffCurve
    programId,
    associatedTokenProgramId
  );

  // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
  // Sadly we can't do this atomically.
  let account: Account;
  try {
    account = await getAccount(connection, associatedToken, commitment, programId);
  } catch (error: unknown) {
    // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
    // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
    // TokenInvalidAccountOwnerError in this code path.
    if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
      // As this isn't atomic, it's possible others can create associated accounts meanwhile.
      try {
        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            associatedToken,
            owner,
            mint,
            programId,
            associatedTokenProgramId
          )
        );

        // await sendAndConfirmTransaction(connection, transaction, [payer], confirmOptions);
        const signature = await wallet.sendTransaction(
          transaction,
          connection,
        );
        await confirmTransaction(connection, signature);
      } catch (error: unknown) {
        // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
        // instruction error if the associated account exists already.
      }

      // Now this should always succeed
      account = await getAccount(connection, associatedToken, commitment, programId);
    } else {
      throw error;
    }
  }

  if (!account.mint.equals(mint)) throw new TokenInvalidMintError();
  if (!account.owner.equals(owner)) throw new TokenInvalidOwnerError();

  // return mint.publicKey;
  return account;
}


/**
 * Based on @solana/spl-token `mintTo` function
 */
export async function executeMint(
  connection: Connection,
  wallet: WalletContextState,
  mint: PublicKey,
  amount: number | bigint,
) {
  if (!wallet || !wallet.publicKey) throw new WalletNotConnectedError();
  const destination = getAssociatedTokenAddressSync(
    mint, wallet.publicKey, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const transaction = new Transaction().add(
    createMintToInstruction(
      mint, destination, wallet.publicKey, amount, [wallet.publicKey], TOKEN_PROGRAM_ID
    )
  );

  // sending instructions to
  const signature = await wallet.sendTransaction(transaction, connection);
  await confirmTransaction(connection, signature);
}


/**
 * Based on @solana/spl-token functions
 */
export async function executeTransfer(
  connection: Connection,
  wallet: WalletContextState,
  mint: PublicKey,
  receiver: PublicKey,
  amount: number | bigint,
) {
  if (!wallet || !wallet.publicKey) throw new WalletNotConnectedError();
  const source = getAssociatedTokenAddressSync(
    mint, wallet.publicKey, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
  );
  // In this function we derive associated token account address from 
  // receivers wallet. But if you know associated token account address
  // already and you want to transfer tokens to it, you won't care about the owner
  const destination = getAssociatedTokenAddressSync(
    mint, receiver, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const transaction = new Transaction();

  // check if account exists
  try {
    await getAccount(connection, destination, undefined, TOKEN_PROGRAM_ID);
  } catch (error: unknown) {
    if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
      // if not - we'll create account
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          destination,
          receiver,
          mint,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
      console.log(`Will create account: ${destination.toBase58()}`);
    } else {
      throw error;
    }
  }

  transaction.add(
    createTransferInstruction(
      source, destination, wallet.publicKey, amount, [wallet.publicKey], TOKEN_PROGRAM_ID
    )
  );

  // sending instructions to
  const signature = await wallet.sendTransaction(transaction, connection);
  await confirmTransaction(connection, signature);

  console.log(`Transferred: from ${wallet.publicKey.toBase58()} (account: ${source.toBase58()}) to ${receiver.toBase58()
    } (account: ${destination.toBase58()}). Amount: ${amount}`);
}


/**
 * Based on @solana/spl-token function
 */
export async function executeBurn(
  connection: Connection,
  wallet: WalletContextState,
  mint: PublicKey,
  account: PublicKey,
  owner: PublicKey,
  amount: bigint,
) {
  if (!wallet || !wallet.publicKey) throw new WalletNotConnectedError();

  const transaction = new Transaction().add(
    createBurnInstruction(
      account,
      mint,
      owner,
      amount,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  // sending instructions to
  const signature = await wallet.sendTransaction(transaction, connection);
  await confirmTransaction(connection, signature);

  console.log(`Burned: account: ${account.toBase58()} Amount: ${amount}`);
}

/**
 * Gets largest token accounts and parses data
 */
export type TokenAccountData = {
  accountOwner: PublicKey,
  associatedAccount: PublicKey,
  amount: bigint,
};
export async function getLargestParsedAccounts(
  connection: Connection,
  mint: PublicKey,
): Promise<TokenAccountData[]> {
  const accounts = (await connection.getTokenLargestAccounts(mint))
    .value.map(el => el.address);

  return (await connection.getMultipleAccountsInfo(accounts))
    .map((account, index) => {
      const parsedData = unpackAccount(
        mint,
        account,
      );

      return {
        accountOwner: parsedData.owner,
        associatedAccount: accounts[index],
        amount: parsedData.amount,
      }
    });
}