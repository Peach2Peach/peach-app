import { BIP32Interface } from 'bip32'
import { peachAPI } from './peachAPI'

let peachAccount: BIP32Interface | null
export const setPeachAccount = (acc: BIP32Interface) => {
  peachAPI.setPeachAccount(acc)
  peachAccount = acc
}
export const getPeachAccount = () => peachAccount
export const deletePeachAccount = () => (peachAccount = null)
