import { useContext, useEffect } from 'react'
import shallow from 'zustand/shallow'
import { useMatchStore } from '../../../components/matches/store'
import { MessageContext } from '../../../contexts/message'
import { useNavigation } from '../../../hooks'
import { useOfferMatches } from './useOfferMatches'
import useRefetchOnNotification from './useRefetchOnNotification'

export const useSearchSetup = () => {
  const navigation = useNavigation()

  const [, updateMessage] = useContext(MessageContext)
  const [offer, addMatchSelectors] = useMatchStore((state) => [state.offer, state.addMatchSelectors], shallow)

  const { allMatches: matches, error, refetch } = useOfferMatches()
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

  return !!offer.matches.length
}
