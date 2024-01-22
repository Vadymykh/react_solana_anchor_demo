import { PublicKey } from '@solana/web3.js'
import { FC, useEffect } from 'react'
import { accountLink, toDecimalsAmount } from '../../../solana/helpers'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import ToolTip from '../../Tooltip/ToolTip';
import { Account, Mint } from '@solana/spl-token';
import { TokenAccountData, executeBurn, getLargestParsedAccounts } from '../../../scripts/tokenSplBrowserHelpers';
import { LargestAccountsStyled } from './LargestAccounts.styled';

interface LargestAccountsProps {
  mintInfo: Mint,
  largestAccounts: TokenAccountData[],
  setLargestAccounts: React.Dispatch<React.SetStateAction<TokenAccountData[]>>
  setTokensReceiverAddress: React.Dispatch<React.SetStateAction<string>>
}

const LargestAccounts: FC<LargestAccountsProps> = ({
  mintInfo,
  largestAccounts,
  setLargestAccounts,
  setTokensReceiverAddress,
}) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  // const [parsedAccounts, setParsedAccounts] = useState<>([]);

  // update largest accounts
  useEffect(() => {
    mintInfo && getLargestParsedAccounts(connection, mintInfo.address)
      .then((data) => {
        setLargestAccounts(data)
      });
  }, [mintInfo]);

  return <LargestAccountsStyled>
    {largestAccounts.map((account) => (
      <div key={account.accountOwner.toBase58()} className="account">
        <div>
          <div>Wallet
            <ToolTip text='User wallet address' />
            <button
              onClick={() => setTokensReceiverAddress(account.accountOwner.toBase58())}
              className='small-button'
            >Set as receiver</button>
          </div>
          <div>{accountLink(account.accountOwner)}</div>
          <div>
            Associated account
            <ToolTip text='Associated with wallet token account, that holds user token data' />
          </div>
          <div>{accountLink(account.associatedAccount)}</div>
        </div>
        <div>
          {toDecimalsAmount(account.amount, mintInfo.decimals)} tokens
        </div>
      </div>
    ))}
  </LargestAccountsStyled>
}

export default LargestAccounts