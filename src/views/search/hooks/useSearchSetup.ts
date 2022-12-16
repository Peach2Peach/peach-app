import { useContext, useEffect } from 'react'
import { useMatchStore } from '../../../components/matches/store'
import { MessageContext } from '../../../contexts/message'
import { useNavigation, useRoute } from '../../../hooks'
import { useOfferMatches } from './useOfferMatches'
import useRefetchOnNotification from './useRefetchOnNotification'

export const useSearchSetup = () => {
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)
  const { offer } = useRoute<'search'>().params
  const { allMatches: matches, error, refetch } = useOfferMatches()
  const addMatchSelectors = useMatchStore((state) => state.addMatchSelectors)
  const resetStore = useMatchStore((state) => state.resetStore)

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
