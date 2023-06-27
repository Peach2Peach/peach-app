import { useHeaderSetup, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { sum } from '../../../utils/math'
import { isSellOffer, offerIdToHex } from '../../../utils/offer'

export const useWrongFundingAmountSetup = () => {
  const { offerId } = useRoute<'fundEscrow'>().params
  const { offer } = useOfferDetails(offerId)
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined
  const fundingAmount = sellOffer?.amount || 0

  useHeaderSetup({
    title: offerIdToHex(offerId),
  })

  return {
    sellOffer,
    fundingAmount,
    actualAmount: sellOffer?.funding.amounts.reduce(sum, 0) || 0,
  }
}
