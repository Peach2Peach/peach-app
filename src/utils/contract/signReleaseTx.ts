import { Psbt } from 'bitcoinjs-lib'
import { verifyPSBT } from '../../views/contract/helpers/verifyPSBT'
import { getEscrowWallet, getFinalScript, getNetwork, getWallet } from '../wallet'
import { getSellOfferFromContract } from './getSellOfferFromContract'

export const signReleaseTx = (contract: Contract): [string | null, string | null] => {
  const sellOffer = getSellOfferFromContract(contract)
  const sellOfferId = sellOffer.oldOfferId || sellOffer.id

  if (!sellOfferId || !sellOffer?.funding) return [null, 'SELL_OFFER_NOT_FOUND']

  const psbt = Psbt.fromBase64(contract.releaseTransaction, { network: getNetwork() })

  // Don't trust the response, verify
  const errorMsg = verifyPSBT(psbt, sellOffer, contract)

  if (errorMsg) return [null, errorMsg]

  // Sign psbt
  psbt.txInputs.forEach((input, i) =>
    psbt.signInput(i, getEscrowWallet(getWallet(), sellOfferId)).finalizeInput(i, getFinalScript),
  )

  const tx = psbt.extractTransaction().toHex()

  return [tx, null]
}
