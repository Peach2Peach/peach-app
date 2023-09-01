import { BIP32Interface } from 'bip32'
import { Psbt } from 'bitcoinjs-lib'
import { isPSBTForBatch, verifyPSBT } from '../../views/contract/helpers'
import { signPSBT } from '../wallet'

type Props = {
  psbt: Psbt
  contract: Contract
  sellOffer: SellOffer
  wallet: BIP32Interface
}
export const signBatchReleaseTransaction = ({ psbt, contract, sellOffer, wallet }: Props) => {
  // Don't trust the response, verify
  const errorMsg = verifyPSBT(psbt, sellOffer, contract)

  if (errorMsg) throw Error(errorMsg)
  if (!isPSBTForBatch(psbt)) throw Error('Transaction is not for batching')

  signPSBT(psbt, wallet)
  return psbt.toBase64()
}
