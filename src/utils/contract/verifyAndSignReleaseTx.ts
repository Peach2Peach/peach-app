import { BIP32Interface } from 'bip32'
import { Psbt } from 'bitcoinjs-lib'
import { isPSBTForBatch, verifyPSBT } from '../../views/contract/helpers'
import { signAndFinalizePSBT } from '../bitcoin'
import { getNetwork, signPSBT } from '../wallet'

export const verifyAndSignReleaseTx = (
  contract: Contract,
  sellOffer: SellOffer,
  wallet: BIP32Interface,
): [string | null, string | null, boolean] => {
  const sellOfferId = sellOffer.oldOfferId || sellOffer.id

  if (!sellOfferId || !sellOffer?.funding) return [null, 'SELL_OFFER_NOT_FOUND', false]

  const psbt = Psbt.fromBase64(contract.batchReleasePsbt || contract.releasePsbt || contract.releaseTransaction, {
    network: getNetwork(),
  })

  // Don't trust the response, verify
  const errorMsg = verifyPSBT(psbt, sellOffer, contract)

  if (errorMsg) return [null, errorMsg, false]

  if (isPSBTForBatch(psbt)) {
    signPSBT(psbt, wallet)
    return [psbt.toBase64(), null, true]
  }
  signAndFinalizePSBT(psbt, wallet)
  const tx = psbt.extractTransaction().toHex()

  return [tx, null, false]
}
