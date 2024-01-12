import { PublicKey } from "@solana/web3.js";

const TOKEN_ACCOUNT = "solana.spl.token.account";

export function saveTokenAccount(account: string) {
  try {
    new PublicKey(account); // make sure it's valid
    localStorage.setItem(TOKEN_ACCOUNT, account);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}

export function loadTokenAccount() {
  try {
    const account = localStorage.getItem(TOKEN_ACCOUNT);
    if (!account) return undefined;
    return new PublicKey(account);
  } catch (err) {
    return undefined;
  }
}