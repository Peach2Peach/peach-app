import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useMatchStore } from '../../../components/matches/store'
import { useMessageState } from '../../../components/message/useMessageState'
import { useNavigation, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { parseError } from '../../../utils/result'
import { shouldGoToContract } from '../helpers/shouldGoToContract'
import { useOfferMatches } from './useOfferMatches'
import { useRefetchOnNotification } from './useRefetchOnNotification'

export const useSearchSetup = () => {
  const navigation = useNavigation()
  const { offerId } = useRoute<'search'>().params
  const { allMatches: matches, error, refetch } = useOfferMatches(offerId)

  const updateMessage = useMessageState((state) => state.updateMessage)
  const { offer } = useOfferDetails(offerId)

  const [addMatchSelectors, resetStore] = useMatchStore((state) => [state.addMatchSelectors, state.resetStore], shallow)

  useEffect(() => {
    if (offer?.meansOfPayment) addMatchSelectors(matches, offer.meansOfPayment)
  }, [addMatchSelectors, matches, offer?.meansOfPayment])

  useEffect(
    () => () => {
      resetStore()
    },
    [resetStore],
  )

  useEffect(() => {
    if (error) {
      const errorMessage = parseError(error?.error)
      if (errorMessage === 'CANCELED' || errorMessage === 'CONTRACT_EXISTS') {
        if (shouldGoToContract(error)) navigation.replace('contract', { contractId: error.details.contractId })
        return
      }
      if (errorMessage !== 'UNAUTHORIZED') {
        updateMessage({ msgKey: errorMessage, level: 'ERROR' })
      }
    }
  }, [error, navigation, offerId, updateMessage])

  useRefetchOnNotification(refetch)

  return { offer, hasMatches: !!matches.length }
}
