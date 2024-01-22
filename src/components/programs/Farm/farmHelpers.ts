import {
  type Connection,
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
  Commitment,
  ConfirmOptions,
  TransactionInstruction
} from "@solana/web3.js";
import { getTokenAccountAndOptionalAddInstruction } from "../../../scripts/tokenSplBrowserHelpers";
import { BN, IdlAccounts, Program, utils } from "@coral-xyz/anchor";
import { IDL as FarmIDL, Farm as FarmType } from "./idl/farm";
import { IDL as TokenMinterIDL, TokenMinter as TokenMinterType } from "./idl/token_minter";
import { minterPDA } from "./Farm";
import { TOKEN_PROGRAM_ID, approve, createApproveInstruction } from "@solana/spl-token";
import { confirmTransaction } from "../../../solana/helpers";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export type FarmDataType = IdlAccounts<FarmType>["farmData"];
export type DepositDataType = IdlAccounts<FarmType>["depositData"];

export async function executeMintStakeTokens(
  connection: Connection,
  wallet: AnchorWallet,
  farmData: FarmDataType,
  tokenMinterProgram: Program<TokenMinterType>,
) {
  if (!wallet.publicKey) return;

  const {
    tokenAccount, instructions
  } = await getTokenAccountAndOptionalAddInstruction(
    connection,
    wallet.publicKey,
    farmData.stakeToken,
    wallet.publicKey,
  );

  const toMint = new BN(100e9);

  const tx = await tokenMinterProgram.methods
    .mint(toMint)
    .accounts({
      minterAccount: minterPDA,
      destination: tokenAccount,
      mint: farmData.stakeToken,
      tokenProgram: TOKEN_PROGRAM_ID
    })
    .preInstructions([...instructions])
    .rpc();

  await confirmTransaction(connection, tx);
}

export function getUserDepositPDA(
  wallet: AnchorWallet,
  farmPDA: PublicKey,
  farmProgram: Program<FarmType>,
) {
  const [userDepositPDA,] = PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('deposit'),
      farmPDA.toBuffer(),
      wallet.publicKey.toBuffer(),
    ],
    farmProgram.programId
  );

  return userDepositPDA;
}


export async function executeDeposit(
  connection: Connection,
  wallet: AnchorWallet,
  farmData: FarmDataType,
  farmPDA: PublicKey,
  farmProgram: Program<FarmType>,
  amount: BN
) {
  const [userDepositPDA,] = PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('deposit'),
      farmPDA.toBuffer(),
      wallet.publicKey.toBuffer(),
    ],
    farmProgram.programId
  );

  let preInstructions: TransactionInstruction[] = [];

  if (!await connection.getAccountInfo(userDepositPDA)) {
    preInstructions.push(
      await farmProgram.methods
        .initializeDeposit()
        .accounts({
          signer: wallet.publicKey,
          depositAccount: userDepositPDA,
          farmAccount: farmPDA,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    )
  }

  const {
    tokenAccount: farmStakeTokenAccount,
    instructions: farmStakeAccountInstructions,
  } = await getTokenAccountAndOptionalAddInstruction(
    connection,
    wallet.publicKey,
    farmData.stakeToken,
    farmPDA,
  );

  const {
    tokenAccount: stakeAccount,
    instructions: stakeAccountInstructions,
  } = await getTokenAccountAndOptionalAddInstruction(
    connection,
    wallet.publicKey,
    farmData.stakeToken,
    wallet.publicKey,
  );

  const {
    tokenAccount: rewardAccount,
    instructions: rewardAccountInstructions,
  } = await getTokenAccountAndOptionalAddInstruction(
    connection,
    wallet.publicKey,
    farmData.rewardToken,
    wallet.publicKey,
  );

  preInstructions = [
    ...preInstructions,
    ...farmStakeAccountInstructions,
    ...stakeAccountInstructions,
    ...rewardAccountInstructions,
  ];

  preInstructions.push(
    createApproveInstruction(
      stakeAccount,
      farmPDA,
      wallet.publicKey,
      amount
    )
  );

  const tx = await farmProgram.methods
    .deposit(amount)
    .preInstructions(preInstructions)
    .accounts({
      signer: wallet.publicKey,
      depositAccount: userDepositPDA,
      farmAccount: farmPDA,
      systemProgram: SystemProgram.programId,
      token: TOKEN_PROGRAM_ID,
      stakeToken: farmData.stakeToken,
      rewardToken: farmData.rewardToken,
      farmStakeTokenAccount,
      userStakeTokenAccount: stakeAccount,
      userRewardTokenAccount: rewardAccount
    })
    .rpc();

  await confirmTransaction(connection, tx);
}

export async function executeWithdrawal(
  connection: Connection,
  wallet: AnchorWallet,
  farmData: FarmDataType,
  farmPDA: PublicKey,
  farmProgram: Program<FarmType>,
  amount: BN
) {
  const [userDepositPDA,] = PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('deposit'),
      farmPDA.toBuffer(),
      wallet.publicKey.toBuffer(),
    ],
    farmProgram.programId
  );

  let preInstructions: TransactionInstruction[] = [];

  if (!await connection.getAccountInfo(userDepositPDA)) {
    preInstructions.push(
      await farmProgram.methods
        .initializeDeposit()
        .accounts({
          signer: wallet.publicKey,
          depositAccount: userDepositPDA,
          farmAccount: farmPDA,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    )
  }

  const {
    tokenAccount: farmStakeTokenAccount,
    instructions: farmStakeAccountInstructions,
  } = await getTokenAccountAndOptionalAddInstruction(
    connection,
    wallet.publicKey,
    farmData.stakeToken,
    farmPDA,
  );

  const {
    tokenAccount: stakeAccount,
    instructions: stakeAccountInstructions,
  } = await getTokenAccountAndOptionalAddInstruction(
    connection,
    wallet.publicKey,
    farmData.stakeToken,
    wallet.publicKey,
  );

  const {
    tokenAccount: rewardAccount,
    instructions: rewardAccountInstructions,
  } = await getTokenAccountAndOptionalAddInstruction(
    connection,
    wallet.publicKey,
    farmData.rewardToken,
    wallet.publicKey,
  );

  preInstructions = [
    ...preInstructions,
    ...farmStakeAccountInstructions,
    ...stakeAccountInstructions,
    ...rewardAccountInstructions,
  ];

  preInstructions.push(
    createApproveInstruction(
      stakeAccount,
      farmPDA,
      wallet.publicKey,
      amount
    )
  );

  const tx = await farmProgram.methods
    .withdraw(amount)
    .accounts({
      signer: wallet.publicKey,
      depositAccount: userDepositPDA,
      farmAccount: farmPDA,
      systemProgram: SystemProgram.programId,
      token: TOKEN_PROGRAM_ID,
      stakeToken: farmData.stakeToken,
      rewardToken: farmData.rewardToken,
      farmStakeTokenAccount,
      userStakeTokenAccount: stakeAccount,
      userRewardTokenAccount: rewardAccount
    })
    .rpc();

  await confirmTransaction(connection, tx);
}


const PRECISION_FACTOR = new BN(1000_000_000);
export function calculateEarnedRewards(
  farmData: FarmDataType,
  depositData: DepositDataType,
) {
  const currentTimestamp = Math.round(Number(new Date()) / 1000);

  if (
    currentTimestamp <= Number(farmData.lastRewardTimestamp)
    || farmData.totalStaked.isZero()
  ) {
    return 0;
  }

  const rewards = (new BN(currentTimestamp).sub(farmData.lastRewardTimestamp))
    .mul(farmData.rewardsPerSecond);

  const updatedAccTokenPerStake = farmData.accTokensPerStake.add(
    rewards.mul(PRECISION_FACTOR).div(farmData.totalStaked)
  )

  const pendingRewards = depositData.staked.mul(
    updatedAccTokenPerStake.sub(depositData.lastUpdateAccTokensPerStake)
  ).div(PRECISION_FACTOR);
  
  return Number(pendingRewards) / 1e9;
}