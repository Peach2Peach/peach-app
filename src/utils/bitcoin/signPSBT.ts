import { Psbt } from 'bitcoinjs-lib'
import { getWallet, getEscrowWallet, getFinalScript } from '../../utils/wallet'

/**
 * @description Method to sign a PSBT
 * @param psbt partially signed bitcoin transaction
 * @param sellOffer sell offer
 * @param finalize if true finalize transcation
 * @returns signed PSBT
 */
export const signPSBT = (psbt: Psbt, sellOffer: SellOffer, finalize = true): Psbt => {
  // Sign psbt
  psbt.txInputs.forEach((input, i) => {
    psbt.signInput(i, getEscrowWallet(getWallet(), sellOffer.oldOfferId || sellOffer.id))
    if (finalize) psbt.finalizeInput(i, getFinalScript)
  })

  return psbt
}
