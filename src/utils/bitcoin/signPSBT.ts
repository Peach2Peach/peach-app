import { Psbt } from 'bitcoinjs-lib'
import { getEscrowWallet, getFinalScript } from '../../utils/wallet'

export const signPSBT = (
  psbt: Psbt,
  offer: SellOffer,
  finalize = true
): Psbt => {
  // Sign psbt
  psbt.txInputs.forEach((input, i) => {
    psbt.signInput(i, getEscrowWallet(offer.id!))
    if (finalize) psbt.finalizeInput(i, getFinalScript)
  })

  return psbt
}