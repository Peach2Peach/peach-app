import { checkRefundPSBT } from './checkRefundPSBT'
import { refundSellOffer } from './refundSellOffer'

/**
 * @description Method to check psbt for validity and if ok, refund
 * @param psbtBase64 base64 encoded psbt
 * @param offer sell offer to refund
 * @returns refunding status
 */
export const checkAndRefund = async (psbtBase64: string, offer: SellOffer): Promise<RefundingStatus> => {
  const { isValid, psbt, err } = await checkRefundPSBT(psbtBase64, offer)

  if (!isValid || !psbt || err) return { err }

  return await refundSellOffer(psbt, offer)
}
