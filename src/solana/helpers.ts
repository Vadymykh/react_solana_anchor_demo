import { AnchorProvider } from "@coral-xyz/anchor";

export async function confirmTransaction(
    provider: AnchorProvider, tx: string,
) {
    const latestBlockHash = await provider.connection.getLatestBlockhash();
      
    return await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    });
} 