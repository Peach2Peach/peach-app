import { BIP32Interface } from 'bip32'
import { Psbt } from 'bitcoinjs-lib'
import { verifyPSBT } from '../../views/contract/helpers'
import { signAndFinalizePSBT } from '../bitcoin/signAndFinalizePSBT'

type Props = {
  psbt: Psbt
  contract: Contract
  sellOffer: SellOffer
  wallet: BIP32Interface
}
export const signReleaseTransaction = ({ psbt, contract, sellOffer, wallet }: Props) => {
  // Don't trust the response, verify
  const errorMsg = verifyPSBT(psbt, sellOffer, contract)

  if (errorMsg) throw Error(errorMsg)

  signAndFinalizePSBT(psbt, wallet)
  return psbt.extractTransaction().toHex()
}
