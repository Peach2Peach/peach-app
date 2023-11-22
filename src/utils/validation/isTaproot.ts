export const isTaproot = (address: string) => /^(tb1p|bcrt1p|bc1p)/u.test(address)
