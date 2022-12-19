import { useContext, useEffect } from 'react'
import { useMatchStore } from '../../../components/matches/store'
import { MessageContext } from '../../../contexts/message'
import { useNavigation, useRoute } from '../../../hooks'
import { error as logError } from '../../../utils/log'
import { getOffer } from '../../../utils/offer'
import { useOfferMatches } from './useOfferMatches'
import useRefetchOnNotification from './useRefetchOnNotification'

export const useSearchSetup = () => {
  const navigation = useNavigation()
  const { offerId } = useRoute<'search'>().params

  const [, updateMessage] = useContext(MessageContext)
  const [offer, setOffer, addMatchSelectors] = useMatchStore((state) => [
    state.offer,
    state.setOffer,
    state.addMatchSelectors,
  ])

  const { allMatches: matches, error, refetch } = useOfferMatches()
  const resetStore = useMatchStore((state) => state.resetStore)

  useEffect(() => {
    const offr = getOffer(offerId)

    if (!offr) {
      logError('Missing offer id')
      return
    }
    setOffer(offr)
  }, [offerId, setOffer])

  useEffect(() => {
    addMatchSelectors(matches, offer.meansOfPayment)
  }, [offer.meansOfPayment, addMatchSelectors, matches])

  useEffect(
    () => () => {
      resetStore()
    },
    [resetStore],
  )

  useEffect(() => {
    if (error) {
      if (error === 'CANCELED' || error === 'CONTRACT_EXISTS') {
        navigation.navigate('offer', { offer })
        return
      }
      if (error !== 'UNAUTHORIZED' && typeof error === 'string') {
        updateMessage({ msgKey: error, level: 'ERROR' })
      }
    }
  }, [error, navigation, offer, updateMessage])

  useRefetchOnNotification(refetch, offer.id)

  return !!matches.length
}
