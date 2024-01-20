import React, { useCallback, useEffect, useMemo, useState } from "react";
import ProgramWrapper from "../../ProgramWrapper/ProgramWrapper";
import { IDL, SimpleCounter as SimpleCounterType } from "./simple_counter_idl";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useAnchorProvider } from "../../../solana/solana-provider";
import { Program, BN, web3 } from "@coral-xyz/anchor";
import * as buffer from "buffer";
import { confirmTransaction } from "../../../solana/helpers";

window.Buffer = buffer.Buffer;
type Props = {};

const programExecutableAddress = "5nhzJ6xgHimxkTvopMgKk6byPiVNdZNZqTB87p4amega";
const programAccountAddress = "2SgAfrgHBNjHfhC4ReQbBUwzxTYiNPrLe6kzn1nZ8YGb";
const programID = new PublicKey(programExecutableAddress);
const programAccount = new PublicKey(programAccountAddress);

const SimpleCounter: React.FC<Props> = () => {
  const provider = useAnchorProvider();
  const program = useMemo(
    () => new Program<SimpleCounterType>(IDL, programID, provider),
    [IDL, programID, provider]
  );
  const [counter, setCounter] = useState<number | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    program.account.simpleCounterData.fetch(programAccount)
      .then((accountData) => {
        setCounter(accountData.data.toNumber())
      });
  }, []);

  const initialize = async () => {
    try {
      const newAccount = Keypair.generate();
      /* interact with the program via rpc */
      const tx = await program.methods.initialize()
        .accounts({ 
          counterData: newAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([newAccount])
        .rpc();

      await confirmTransaction(provider.connection, tx);
      
      console.log(`New data account created: ${newAccount.publicKey.toBase58()}`);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  const increment = async () => {
    try {
      /* interact with the program via rpc */
      const tx = await program.methods.increment()
        .accounts({ counterData: programAccount })
        .rpc();

      await confirmTransaction(provider.connection, tx);

      // fetch updated data from blockchain
      const account = await program.account.simpleCounterData.fetch(programAccount);
      setCounter(account.data.toNumber());
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function setCounterValue() {
    try {
      /* interact with the program via rpc */
      const tx = await program.methods.setCounter(new BN(value))
        .accounts({ counterData: programAccount })
        .rpc();

      await confirmTransaction(provider.connection, tx);

      // fetch updated data from blockchain
      const account = await program.account.simpleCounterData.fetch(programAccount);
      setCounter(account.data.toNumber());
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  return (
    <ProgramWrapper
      title={"Simple Counter"}
      programId={programExecutableAddress}
      programAccount={programAccountAddress}
      description={<span>
        Simple Anchor program that stores&nbsp;
        <i>u128</i> counter value and has&nbsp;
        <i>increment</i> and <i>setCounter</i> methods
      </span>}
    >
      <div className="text-info">Counter value: <span className="text-value">{counter}</span></div>
      <div className="horizontal-container">
        {/* <button onClick={initialize}>Deploy new counter</button> */}
        <button onClick={increment}>Increment</button>
        <button onClick={setCounterValue}>Set counter value</button>
        <input value={value} onChange={(e) => setValue(Number(e.target.value))} />
      </div>
    </ProgramWrapper>
  );
}

export default SimpleCounter;
