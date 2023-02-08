import { useNavigation, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { isBuyOffer } from '../../../utils/offer'

export const useOfferPublishedSetup = () => {
  const { offerId } = useRoute<'offerPublished'>().params
  const { offer } = useOfferDetails(offerId)
  const navigation = useNavigation()
  const goBackHome = () => offer && navigation.replace(isBuyOffer(offer) ? 'buy' : 'sell')

  return goBackHome
}
