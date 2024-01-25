import React, { useEffect, useMemo, useState } from "react";
import ProgramWrapper from "../../ProgramWrapper/ProgramWrapper";
import { IDL as FarmIDL, Farm as FarmType } from "./idl/farm";
import { IDL as TokenMinterIDL, TokenMinter as TokenMinterType } from "./idl/token_minter";
import { PublicKey } from "@solana/web3.js";
import { useAnchorProvider } from "../../../solana/solana-provider";
import { Program, BN } from "@coral-xyz/anchor";
import * as buffer from "buffer";
import { accountLink } from "../../../solana/helpers";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  DepositDataType,
  FarmDataType,
  calculateEarnedRewards,
  executeDeposit,
  executeMintStakeTokens,
  executeWithdrawal,
  getUserDepositPDA
} from "./farmHelpers";

window.Buffer = buffer.Buffer;
type Props = {};

const tokenMinterExecutableAddress = "H8ULdnCzWHR2mj8wkkbZNMHTXwBdwwFqpif5t1tpygT5";
const farmExecutableAddress = "FcVrY6gNjH1tMp1h9QtzWYQKDJGtz5h2nZUkG4vqHBTy";
const farmPdaAddress = "9Yuv9De9qUtsEnFEyogdjFKpCCUQ31fNRSfNjgSZvhou";
const minterPdaAddress = "A5kTzRGSAXCAksZCzZL59jkFV1HtCYUoG5tWwjExP98G";
const tokenMinterProgramID = new PublicKey(tokenMinterExecutableAddress);
const farmExecutableProgramID = new PublicKey(farmExecutableAddress);
const farmPDA = new PublicKey(farmPdaAddress);
export const minterPDA = new PublicKey(minterPdaAddress);

const Farm: React.FC<Props> = () => {
  const provider = useAnchorProvider();
  const { connection, wallet } = provider;

  const [farmData, setFarmData] = useState<FarmDataType>();
  const [depositData, setDepositData] = useState<DepositDataType>();
  const [stakeAmount, setStakeAmount] = useState<undefined | number>();
  const [earnedRewards, setEarnedRewards] = useState(0);
  const [stakeTokenBalance, setStakeTokenBalance] = useState(0);

  const tokenMinterProgram = useMemo(
    () => new Program<TokenMinterType>(TokenMinterIDL, tokenMinterProgramID, provider),
    [TokenMinterIDL, tokenMinterProgramID, provider]
  );

  const farmProgram = useMemo(
    () => new Program<FarmType>(FarmIDL, farmExecutableProgramID, provider),
    [FarmIDL, farmExecutableProgramID, provider]
  );

  async function updateDepositData() {
    if (!wallet || !wallet.publicKey) return;
    const userDepositPDA = getUserDepositPDA(wallet, farmPDA, farmProgram);
    if (
      !depositData                                        // if depositData was not fetched yet
      && !await connection.getAccountInfo(userDepositPDA) // if account wasn't even created
    ) return;

    const _depositData = await farmProgram.account.depositData.fetch(userDepositPDA);
    setDepositData(_depositData);
  }

  function updateFarmData() {
    farmProgram.account.farmData.fetch(farmPDA)
      .then(_farmData => setFarmData(_farmData));
  }

  useEffect(() => {
    updateFarmData();
    farmProgram.account.depositData.all([
      {
        memcmp: {
          offset: 8,
          bytes: farmPDA.toBase58(),
        },
      },
    ])
      .then(depositData => {
        console.log(depositData);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!farmData || !depositData) return;
      if (depositData?.staked.isZero()) setEarnedRewards(0);
      setEarnedRewards(calculateEarnedRewards(
        farmData,
        depositData
      ));
    }, 500);

    return () => {
      clearInterval(timer)
    }
  }, [farmData, depositData, wallet]);


  useEffect(() => {
    if (!farmData) return;
    updateStakeBalance();
    updateDepositData();
  }, [farmData, wallet]);

  async function updateStakeBalance() {
    if (!farmData || !wallet || !wallet.publicKey) return;

    const account = getAssociatedTokenAddressSync(
      farmData.stakeToken,
      wallet.publicKey
    );

    try {
      const balance = await connection.getTokenAccountBalance(
        account
      );
      setStakeTokenBalance(Number(balance.value.amount) / 10 ** balance.value.decimals);
    } catch (_) { }
  }

  async function mintStakeTokens() {
    if (!farmData) return;

    try {
      await executeMintStakeTokens(
        connection,
        wallet,
        farmData,
        tokenMinterProgram,
      );
    } catch (err) {
      console.log(err);
    }

    await updateStakeBalance();
  }

  async function deposit() {
    if (!farmData || !stakeAmount) return;

    try {
      await executeDeposit(
        connection,
        wallet,
        farmData,
        farmPDA,
        farmProgram,
        new BN(stakeAmount * 1e9)
      );
    } catch (err) {
      console.log(err);
    }

    updateFarmData();
  }

  async function withdraw(amount: 0 | null = null) {
    if (!farmData || !stakeAmount) return;

    try {
      await executeWithdrawal(
        connection,
        wallet,
        farmData,
        farmPDA,
        farmProgram,
        amount === 0
          ? new BN(0)
          : new BN(stakeAmount * 1e9)
      );
    } catch (err) {
      console.log(err);
    }

    updateFarmData();
  }

  return (
    <ProgramWrapper
      title={"Farm"}
      programId={farmExecutableAddress}
      description={<span>
        Simple farm that mints reward tokens as a reward for staking stake tokens. Fixed rewards per second
      </span>}
    >
      <div>
        <div className="horizontal-container" style={{ flexWrap: 'wrap' }}>
          <div>
            <div className="text-info">Stake token balance</div>
            <div>Current stake balance: <span className="text-value">
              {stakeTokenBalance}
            </span></div>
          </div>
          <button
            onClick={mintStakeTokens}
          >Get 100  stake tokens</button>
        </div>
        <div className="horizontal-container" style={{ flexWrap: 'wrap' }}>
          {farmData && <div>
            <div className="text-info">Farm Data</div>
            <div>Total staked: <span className="text-value">
              {Number(farmData.totalStaked.toString()) / 1e9}
            </span></div>
            <div>accTokensPerStake: <span className="text-value">
              {farmData.accTokensPerStake.toString()}
            </span></div>
            <div>Farm owner: {accountLink(farmData.authority)}</div>
            <div>Stake token: {accountLink(farmData.stakeToken)}</div>
            <div>Reward token owner: {accountLink(farmData.rewardToken)}</div>
          </div>}
          <div>
            <div className="text-info">Deposit Data</div>
            <div>Staked: <span className="text-value">
              {depositData
                ? Number(depositData.staked.toString()) / 1e9
                : 0
              }
            </span></div>
            <div>Earned rewards: <span className="text-value">
              {earnedRewards}
            </span></div>
          </div>
        </div>
        <div>
          <div className="text-info">Actions</div>
          <div className="horizontal-container" style={{ flexWrap: 'wrap' }}>
            <button
              disabled={stakeTokenBalance === 0 || !stakeAmount}
              onClick={deposit}
            >Deposit</button>
            <button
              disabled={!depositData || depositData.staked === 0 || !stakeAmount}
              onClick={() => withdraw()}
            >Withdraw</button>
            <input
              placeholder="amount"
              onChange={e => setStakeAmount(Number(e.target.value))}
            />
            <button
              disabled={earnedRewards === 0}
              onClick={() => withdraw(0)}
            >Claim rewards</button>
          </div>
        </div>
      </div>
    </ProgramWrapper>
  );
}

export default Farm;
