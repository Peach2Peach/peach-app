import { getNetwork, createWalletFromBase58 } from '../wallet'

export const loadAccountFromBase58 = (base58: string) => createWalletFromBase58(base58, getNetwork())
