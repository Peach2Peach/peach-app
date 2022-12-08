import { checkRefundPSBT, signPSBT } from '../../../utils/bitcoin'
import { saveOffer } from '../../../utils/offer'
import { patchOffer } from '../../../utils/peachAPI'

export const handleRefundTx = async (offer: BuyOffer | SellOffer, result: MatchResponse) => {
  if (offer.type === 'ask' && result.refundTx) {
    let refundTx = offer.refundTx
    const { isValid, psbt } = checkRefundPSBT(result.refundTx, offer)
    if (isValid && psbt) {
      const signedPSBT = signPSBT(psbt, offer, false)
      const [patchOfferResult] = await patchOffer({
        offerId: offer.id!,
        refundTx: signedPSBT.toBase64(),
      })
      if (patchOfferResult) refundTx = psbt.toBase64()
    }
    saveOffer({
      ...offer,
      doubleMatched: true,
      contractId: result.contractId,
      refundTx,
    })
    return result.contractId
  }
  return undefined
}
