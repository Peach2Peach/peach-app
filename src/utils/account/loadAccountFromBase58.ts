import { createWalletFromBase58 } from '../wallet/createWalletFromBase58'
import { getNetwork } from '../wallet/getNetwork'

export const loadAccountFromBase58 = (base58: string) => createWalletFromBase58(base58, getNetwork())
