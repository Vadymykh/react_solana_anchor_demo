import { Mint } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

export async function confirmTransaction(
  connection: Connection, tx: string,
) {
  const latestBlockHash = await connection.getLatestBlockhash();

  return await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: tx,
  });
}

export function accountLink(account: PublicKey | string | null | undefined) {
  if (!account) return <span className="text-value">none</span>

  const accountString = typeof account === 'string' ? account : account.toBase58();

  return <a
    href={`https://solscan.io/account/${accountString}?cluster=devnet`}
    target="_blank"
  >{accountString}</a>
}

export function toDecimalsAmount(amount: bigint, mintInfo: Mint | undefined) {
  return <span className="text-value">{
    mintInfo ? Number(amount) / 10**mintInfo.decimals
    : "none"
  }</span>;
}