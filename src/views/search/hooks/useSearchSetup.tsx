import { useEffect } from 'react'
import { useMessageState } from '../../../components/message/useMessageState'
import { FIFTEEN_SECONDS } from '../../../constants'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useNavigation } from '../../../hooks/useNavigation'
import { useRoute } from '../../../hooks/useRoute'
import { parseError } from '../../../utils/result/parseError'
import { useOfferMatches } from './useOfferMatches'
import { useRefetchOnNotification } from './useRefetchOnNotification'

const shouldGoToContract = (error: APIError): error is APIError & { details: { contractId: string } } =>
  !!error.details
  && typeof error.details === 'object'
  && 'contractId' in error.details
  && typeof error.details.contractId === 'string'

export const useSearchSetup = () => {
  const navigation = useNavigation()
  const { offerId } = useRoute<'search'>().params
  const { allMatches: matches, error, refetch } = useOfferMatches(offerId, FIFTEEN_SECONDS)

  const updateMessage = useMessageState((state) => state.updateMessage)
  const { offer } = useOfferDetails(offerId)

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
