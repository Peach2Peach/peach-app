import { useEffect } from 'react'
import { useMatchStore } from '../../../components/matches/store'
import { useMessageState } from '../../../components/message/useMessageState'
import { useNavigation, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { parseError } from '../../../utils/result/parseError'
import { shouldGoToContract } from '../helpers/shouldGoToContract'
import { useOfferMatches } from './useOfferMatches'
import { useRefetchOnNotification } from './useRefetchOnNotification'

export const useSearchSetup = () => {
  const navigation = useNavigation()
  const { offerId } = useRoute<'search'>().params
  const { allMatches: matches, error, refetch } = useOfferMatches(offerId)

  const updateMessage = useMessageState((state) => state.updateMessage)
  const { offer } = useOfferDetails(offerId)

  const resetStore = useMatchStore((state) => state.resetStore)

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
