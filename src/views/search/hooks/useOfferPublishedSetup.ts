import { useNavigation, useRoute } from '../../../hooks'

export const useOfferPublishedSetup = () => {
  const { isSellOffer, shouldGoBack, offerId } = useRoute<'offerPublished'>().params
  const navigation = useNavigation()
  const goBackHome = () => navigation.replace(isSellOffer ? 'sell' : 'buy')
  const goToOffer = () => navigation.replace('search', { offerId })
  const goBack = () => navigation.goBack()

  return {
    goToOffer,
    closeAction: shouldGoBack ? goBack : goBackHome,
  }
}
