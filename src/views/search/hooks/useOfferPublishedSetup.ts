import { useNavigation, useRoute } from '../../../hooks'

export const useOfferPublishedSetup = () => {
  const { isSellOffer, shouldGoBack } = useRoute<'offerPublished'>().params
  const navigation = useNavigation()
  const goBackHome = () => navigation.replace(isSellOffer ? 'sell' : 'buy')
  const goBack = () => navigation.goBack()

  return {
    shouldGoBack,
    buttonAction: shouldGoBack ? goBack : goBackHome,
  }
}
