import { Psbt } from 'bitcoinjs-lib'
import { getNetwork } from '../../utils/wallet'
import { txIdPartOfPSBT } from './txIdPartOfPSBT'

export const checkRefundPSBT = (
  psbtBase64: string,
  offer: SellOffer,
): {
  isValid: boolean
  psbt?: Psbt
  err?: string | null
} => {
  if (!offer.id || !psbtBase64) return { isValid: false, err: 'NOT_FOUND' }
  const psbt = Psbt.fromBase64(psbtBase64, { network: getNetwork() })

  if (!psbt || !offer || !offer.funding?.txIds) return { isValid: false, psbt, err: 'NOT_FOUND' }

  // Don't trust the response, verify
  const txIds = offer.funding.txIds
  if (!txIds.every((txId) => txIdPartOfPSBT(txId, psbt))) {
    return { isValid: false, psbt, err: 'INVALID_INPUT' }
  }

  // refunds should only have one output and this is the expected returnAddress
  if (psbt.txOutputs.length > 1) return { isValid: false, err: 'INVALID_OUTPUT' }
  if (psbt.txOutputs[0].address?.toLowerCase() !== offer.returnAddress?.toLowerCase()) {
    return { isValid: false, psbt, err: 'RETURN_ADDRESS_MISMATCH' }
  }
  return {
    isValid: true,
    psbt,
  }
}
