import React, { useCallback, useEffect, useMemo, useState } from "react";
import ProgramWrapper from "../../ProgramWrapper/ProgramWrapper";
import { IDL as CounterIDL, SimpleCounter as SimpleCounterType } from "./simple_counter_idl";
import { IDL as SetterIDL, CounterSetter as CounterSetterType } from "./counter_setter.idl";
import { PublicKey } from "@solana/web3.js";
import { useAnchorProvider } from "../../../solana/solana-provider";
import { Program, BN } from "@coral-xyz/anchor";
import * as buffer from "buffer";
import { accountLink, confirmTransaction } from "../../../solana/helpers";

window.Buffer = buffer.Buffer;
type Props = {};

const counterExecutableAddress = "5nhzJ6xgHimxkTvopMgKk6byPiVNdZNZqTB87p4amega";
const setterExecutableAddress = "H6UFQesVzd1pHJQCkKWCHf1Co2vNJXv76uqLWmAdgm3R";
const counterProgramID = new PublicKey(counterExecutableAddress);
const setterProgramID = new PublicKey(setterExecutableAddress);
const counterAccountAddresses = [
  "2SgAfrgHBNjHfhC4ReQbBUwzxTYiNPrLe6kzn1nZ8YGb",
  "3U3esbqhtow5Q1dawBBD3wMqu4W6fNKckkdmmHsYXigf",
  "HdV9DT9ox25HzzZiYyzzFs94qs5jMjqnCBeQ9GD3W8Mk",
  "57Q2GpvjUnkFATvRGaWNyx93WRYJhGxty1ZLALtrC36G",
  "2zmBSLBv5M2smzpFoGKgmN6ZexXh3p7DoGBsKFPnypAj",
];
const counterAccounts = counterAccountAddresses.map(address => new PublicKey(address));

const CounterSetter: React.FC<Props> = () => {
  const provider = useAnchorProvider();
  const counterProgram = useMemo(
    () => new Program<SimpleCounterType>(CounterIDL, counterProgramID, provider),
    [CounterIDL, counterProgramID, provider]
  );
  const setterProgram = useMemo(
    () => new Program<CounterSetterType>(SetterIDL, setterProgramID, provider),
    [SetterIDL, setterProgramID, provider]
  );
  const [counters, setCounters] = useState<number[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    Promise.all(counterAccounts.map(account =>
      counterProgram.account.simpleCounterData.fetch(account)
    )).then(values => setCounters(values.map(value => value.data.toNumber())));
  }, []);

  async function setCountersValue() {
    if (selectedAccounts.length === 0) return;

    try {
      /* interact with the program via rpc */
      const tx = await setterProgram.methods.setCounters(new BN(value))
        .accounts({ simpleCounterProgram: counterProgramID })
        // counter setter accepts list od counter data accounts as `remainingAccounts`
        .remainingAccounts(selectedAccounts.map(account => ({
          pubkey: new PublicKey(account),
          isSigner: false,
          isWritable: true, // we'll change data of this account
        })))
        .rpc();

      await confirmTransaction(provider.connection, tx);

      // fetch updated data from blockchain
      Promise.all(counterAccounts.map(account =>
        counterProgram.account.simpleCounterData.fetch(account)
      )).then(values => setCounters(values.map(value => value.data.toNumber())))
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }


  return (
    <ProgramWrapper
      title={"Counter setter"}
      programId={setterExecutableAddress}
      description={<span>
        Program that sets values on multiple counters data accounts. CPI (Cross-Program Invocation) example
      </span>}
    >
      <div>
        <div className="horizontal-container">
          <button onClick={setCountersValue}>Set counters value</button>
          <input value={value} onChange={(e) => setValue(Number(e.target.value))} />
        </div>
        {counterAccountAddresses.map((address, index) => (
          <div className="horizontal-container" key={address}>
            <div>
              <input type="checkbox" onChange={(e) => {
                if (e.target.checked) {
                  // add to list
                  setSelectedAccounts(prev => {
                    const newAccounts = [...prev];
                    if (!prev.includes(counterAccountAddresses[index])) {
                      newAccounts.push(counterAccountAddresses[index]);
                    }

                    return newAccounts;
                  });
                } else {
                  // remove from list
                  setSelectedAccounts(prev => {
                    const newAccounts = [...prev]
                      .filter(el => el !== counterAccountAddresses[index]);

                    return newAccounts;
                  });
                }
              }} />
            </div>
            <div>
              Counter data account: {accountLink(address)}
            </div>
            <div>
              Counter value: <span className="text-value">{counters[index]}</span>
            </div>
          </div>
        ))}
      </div>
    </ProgramWrapper>
  );
}

export default CounterSetter;
