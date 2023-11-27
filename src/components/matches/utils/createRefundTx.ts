import { checkRefundPSBT } from '../../../utils/bitcoin'
import { peachAPI } from '../../../utils/peachAPI'
import { getEscrowWalletForOffer, signPSBT } from '../../../utils/wallet'

export const createRefundTx = async (offer: SellOffer, refundTx: string): Promise<string | undefined> => {
  let currentRefundTx = offer.refundTx
  const { isValid, psbt } = checkRefundPSBT(refundTx, offer)
  if (isValid && psbt) {
    const signedPSBT = signPSBT(psbt, getEscrowWalletForOffer(offer))
    const { result: patchOfferResult } = await peachAPI.private.offer.patchOffer({
      offerId: offer.id,
      refundTx: signedPSBT.toBase64(),
    })
    if (patchOfferResult) currentRefundTx = psbt.toBase64()
  }
  return currentRefundTx
}
