import { useEffect } from 'react'
import { useNavigation, useRoute } from '../../../hooks'
import { isBuyOffer } from '../../../utils/offer'
import { useSearchSetup } from './useSearchSetup'

export const useOfferPublishedSetup = () => {
  const offerId = useRoute<'offerPublished'>().params?.offerId

  // TODO Reconsider using useSearchSetup here
  const { offer, hasMatches } = useSearchSetup()
  const navigation = useNavigation()
  const goBackHome = () => offer && navigation.replace(isBuyOffer(offer) ? 'buy' : 'sell')

  useEffect(() => {
    if (hasMatches) navigation.replace('search', { offerId })
  }, [hasMatches, navigation, offerId])

  return { goBackHome }
}
