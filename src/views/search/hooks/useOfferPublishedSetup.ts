import { useEffect } from 'react'
import { useNavigation } from '../../../hooks'
import { isBuyOffer } from '../../../utils/offer'
import { useSearchSetup } from './useSearchSetup'

export const useOfferPublishedSetup = () => {
  const { offer, hasMatches } = useSearchSetup()
  const navigation = useNavigation()
  const goBackHome = () => navigation.navigate(isBuyOffer(offer) ? 'buy' : 'sell')

  useEffect(() => {
    if (hasMatches) navigation.replace('search')
  }, [hasMatches, navigation])

  return { goBackHome }
}
