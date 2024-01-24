import { Verifier } from 'bip322-js'
import { Network, networks } from 'bitcoinjs-lib'

type Props = {
  message: string
  address: string
  signature: string
  network?: Network
}
export const isValidBitcoinSignature = ({ message, address, signature, network = networks.bitcoin }: Props) => {
  try {
    return Verifier.verifySignature(address, message, signature, network)
  } catch (e) {
    return false
  }
}
