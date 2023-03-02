export const isAdvcashWallet = (wallet: string) => /^[uU][A-Za-z\d]{12}$/u.test(wallet.split(' ').join(''))
