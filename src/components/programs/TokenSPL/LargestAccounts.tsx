import { PublicKey, TokenAccountBalancePair } from '@solana/web3.js'
import { FC, useEffect, useState } from 'react'
import { accountLink, toDecimalsAmount } from '../../../solana/helpers'
import { useConnection } from '@solana/wallet-adapter-react';
import './LargestAccounts.css';
import ToolTip from '../../Tooltip/ToolTip';

interface LargestAccountsProps {
  mint: PublicKey,
  largestAccounts: TokenAccountBalancePair[],
  setLargestAccounts: React.Dispatch<React.SetStateAction<TokenAccountBalancePair[]>>
}

const LargestAccounts: FC<LargestAccountsProps> = ({
  mint,
  largestAccounts,
  setLargestAccounts: setLargestAccountss
}) => {
  const { connection } = useConnection();

  // update largest accounts
  useEffect(() => {
    mint && connection.getTokenLargestAccounts(mint)
      .then((data) => {
        setLargestAccountss(data.value);
      });
  }, [mint]);

  return <div className="balance-table">
    <h3> Associated accounts
      <ToolTip text="I couldn't find a way to get wallet address for associated account :(" />
    </h3>
    <h3> Balance </h3>
    {largestAccounts.map(account => (
      <>
        <div>{accountLink(account.address)}</div>
        <div>{toDecimalsAmount(account.amount, account.decimals)} tokens</div>
      </>
    ))}
  </div>
}

export default LargestAccounts