export const isAdvcashWallet = (wallet: string) =>
  /^[ueg][a-z0-9]{12}$/iu.test(wallet.split(" ").join(""));
