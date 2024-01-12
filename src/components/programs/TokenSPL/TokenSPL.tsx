import { useEffect, useState } from "react";
import ProgramWrapper from "../../ProgramWrapper/ProgramWrapper";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as buffer from "buffer";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Account,
  Mint,
  TOKEN_PROGRAM_ID, getAccount, getAssociatedTokenAddressSync, getMint,
} from "@solana/spl-token";
import { createMint, getOrCreateAssociatedTokenAccount, executeMint } from "./tokenSplBrowserHelpers";
import ToolTip from "../../Tooltip/ToolTip";
import { loadTokenAccount, saveTokenAccount } from "./localStorageHelpers";
import { accountLink, toDecimalsAmount } from "../../../solana/helpers";

window.Buffer = buffer.Buffer;


const TokenSPL = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [mint, setMint] = useState<PublicKey | undefined>(loadTokenAccount());
  const [mintInfo, setMintInfo] = useState<Mint | undefined>(undefined);
  const [mintAddress, setMintAddress] = useState("");
  const [associatedAccount, setAssociatedAccount] = useState<Account | undefined>(undefined);
  const [mintAmount, setMintAmount] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);

  // useEffect(() => {
  //   if (!wallet || !wallet.publicKey) return;

  //   connection.getTokenAccountsByOwner(
  //     wallet.publicKey,
  //     { programId: TOKEN_PROGRAM_ID }
  //   ).then((data) => {
  //     console.log(data.value);
  //     data.value.forEach(account => {
  //       console.log(account.pubkey.toBase58());
  //       console.log(account.account.owner.toBase58());
  //     });
  //   });
  // }, [wallet, mint]);

  // Updating global token data
  useEffect(() => {
    console.log("Updating global token data");
    
    if (mint) getMint(connection, mint).then(_mintInfo => { setMintInfo(_mintInfo) });
  }, [wallet, mint, associatedAccount]);

  // Updating Associated user account address
  useEffect(() => {
    console.log("Updating Associated user account address");
    if (!mint || !wallet.publicKey) return;

    const associatedToken = getAssociatedTokenAddressSync(
      mint, wallet.publicKey, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // fetching global token data
    getAccount(connection, associatedToken, undefined, TOKEN_PROGRAM_ID).then(_account => {
      setAssociatedAccount(_account);
    });
  }, [wallet, mint]);

  async function deploy() {
    try {
      const mintPublicKey = await createMint(connection, wallet);

      if (!mintPublicKey) return;
      setMint(mintPublicKey);
      saveTokenAccount(mintPublicKey.toBase58());

      console.log(`Mint: ${mintPublicKey.toBase58()}`);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function createAccount() {
    if (!mint || !wallet || !wallet.publicKey) return;
    try {
      const account = await getOrCreateAssociatedTokenAccount(
        connection, wallet, mint, wallet.publicKey,
      );
      if (!account) return;

      setAssociatedAccount(account);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function mintTokens() {
    if (!mint || !wallet || !wallet.publicKey || !mintAmount) return;

    const toMint = Math.round(mintAmount * 1e9);

    try {
      await executeMint(connection, wallet, mint, toMint);
      setAssociatedAccount(
        await getAccount(connection, associatedAccount!.address, undefined, TOKEN_PROGRAM_ID)
      )
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  return (
    <ProgramWrapper
      title={"Token SPL (Solana Program Library)"}
      programId={TOKEN_PROGRAM_ID.toBase58()}
      description={<span>
        Default Solana token program
      </span>}
    >
      <div className="two-columns-container">
        <div>
          <div>Token address: {accountLink(mint)}
            <ToolTip text="Account where global token-data is stored." />
          </div>
          {
            mintInfo && <>
              <div>Decimals: {mintInfo.decimals}</div>
              <div>Supply: {toDecimalsAmount(mintInfo.supply, mintInfo)}</div>
              <div>Mint Authority: {accountLink(mintInfo.mintAuthority)}</div>
              <div>Freeze Authority: {accountLink(mintInfo.freezeAuthority)}</div>
            </>
          }
        </div>
        <div>
          <div>Associated account:&nbsp;
            {accountLink(associatedAccount?.address)}
            <ToolTip text="Account where user-data is stored.&nbsp;
          We could create it automatically during token deployment&nbsp;
          but in this example I wanted to show that additional instruction is required." />
          </div>
          {mint && !associatedAccount && <p><button onClick={createAccount}>Create associated user account</button></p>}
          {associatedAccount && 
            <div>Balance: {toDecimalsAmount(associatedAccount.amount, mintInfo)}</div>
          }
        </div>
      </div>
      <p className="horizontal-container">
        <button
          onClick={() => {
            try {
              const publicKey = new PublicKey(mintAddress);
              setMint(publicKey);
              saveTokenAccount(mintAddress);
            } catch (_) { }
          }}
        >
          Set manual token address
        </button>
        <input
          style={{ width: "100%" }}
          placeholder="base58 address"
          value={mintAddress}
          onChange={e => setMintAddress(e.target.value)}
        />
      </p>
      <div className="horizontal-container">
        <button onClick={deploy}>
          Deploy new token
          <ToolTip text="Creates new Mint account, which stores `
          mintAuthority`, `freezeAuthority`, `decimals`." />
        </button>
        <button disabled={!mint} onClick={mintTokens}>Mint tokens</button>
        <input
          placeholder="mint amount"
          onChange={e => setMintAmount(Number(e.target.value))}
        />
        <input
          placeholder="transfer amount"
          onChange={e => setTransferAmount(Number(e.target.value))}
        />
        {/* <button onClick={setCounterValue}>Set counter value</button>
        <input value={value} onChange={(e) => setValue(Number(e.target.value))} /> */}
      </div>
    </ProgramWrapper>
  );
}

export default TokenSPL;
