import { useHeaderSetup, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { isSellOffer, offerIdToHex } from '../../../utils/offer'

export const useWrongFundingAmountSetup = () => {
  const { offerId } = useRoute<'fundEscrow'>().params
  const { offer } = useOfferDetails(offerId)
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined

  useHeaderSetup(offerIdToHex(offerId))

  return { sellOffer }
}
