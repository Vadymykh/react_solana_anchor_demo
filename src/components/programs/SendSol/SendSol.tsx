import React, { useState } from "react";
import ProgramWrapper from "../../ProgramWrapper/ProgramWrapper";
import { Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import * as buffer from "buffer";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { accountLink } from "../../../solana/helpers";

window.Buffer = buffer.Buffer;

const TokenSPL: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [receiver, setReceiver] = useState("");
  const [signatureHash, setSignatureHash] = useState("");

  async function sendSol() {
    try {
      if (!publicKey) throw new WalletNotConnectedError();

      const lamports = 0.001 * LAMPORTS_PER_SOL;

      const receiverWallet = Keypair.generate();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiverWallet.publicKey,
          lamports,
        })
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight }
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, { minContextSlot });

      await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

      setSignatureHash(signature.toString());
      setReceiver(receiverWallet.publicKey.toBase58());
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  return (
    <ProgramWrapper
      title={"Send SOL (SystemProgram)"}
      programId={SystemProgram.programId.toBase58()}
      description={<span>SystemProgram. Simple SOL transfer</span>}
    >
      <p>
        <button onClick={sendSol}>Send 0.001 SOL to random wallet</button>
      </p>
      <p>
        Receiver: {receiver
          ? accountLink(receiver)
          : <span className="text-value">Send SOL first</span>}
        <br />
        Transaction signature: {signatureHash
          ? <a
            href={`https://solscan.io/tx/${signatureHash}?cluster=devnet`}
            target="_blank"
          >{signatureHash}</a>
          : <span className="text-value">Send SOL first</span>}
      </p>
    </ProgramWrapper>
  );
}

export default TokenSPL;
