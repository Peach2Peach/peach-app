import { checkRefundPSBT } from './checkRefundPSBT'
import { RefundingStatus, refundSellOffer } from './refundSellOffer'

/**
 * @description Method to check psbt for validity and if ok, refund
 */
export const checkAndRefund = async (psbtBase64: string, offer: SellOffer): Promise<RefundingStatus> => {
  const { isValid, psbt, err } = checkRefundPSBT(psbtBase64, offer)

  if (!isValid || err) return { psbt, err }

  return await refundSellOffer(psbt, offer)
}
