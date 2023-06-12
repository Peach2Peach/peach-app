import { getNetwork } from '../wallet'
import { createWalletFromBase58 } from '../wallet/createWalletFromBase58'

export const loadAccountFromBase58 = (base58: string) => createWalletFromBase58(base58, getNetwork())
