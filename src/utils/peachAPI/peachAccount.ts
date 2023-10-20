import { BIP32Interface } from 'bip32'

let peachAccount: BIP32Interface | null
export const setPeachAccount = (acc: BIP32Interface) => (peachAccount = acc)
export const getPeachAccount = () => peachAccount
export const deletePeachAccount = () => (peachAccount = null)
