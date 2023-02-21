/**
 * @description Method to check whether an address is a taproot address
 * @param address address to check
 * @returns true if address is taproot address
 */
export const isTaproot = (address: string) => /^(tb1p|bcrt1p|bc1p)/u.test(address)
