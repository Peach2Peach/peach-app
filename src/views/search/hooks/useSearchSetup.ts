import { useContext, useEffect } from 'react'
import { useSearchRoute } from '../../../components/matches/hooks'
import { MessageContext } from '../../../contexts/message'
import { useNavigation } from '../../../hooks/useNavigation'
import { info } from '../../../utils/log'
import { useOfferMatches } from './useOfferMatches'
import useRefetchOnNotification from './useRefetchOnNotification'

export const useSearchSetup = () => {
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)
  const { offer } = useSearchRoute().params
  const { allMatches: matches, data, error, refetch } = useOfferMatches()

  useEffect(() => {
    // below functionality not yet implemented
    if (data?.contractId) {
      info('Search.tsx - getOfferDetailsEffect', `navigate to contract ${data.contractId}`)
      navigation.replace('contract', { contractId: data.contractId })
    }
  }, [data?.contractId, navigation])

  useEffect(() => {
    if (error) {
      // below error not yet implemented
      if (error === 'OFFER EXPIRED' || error === 'OFFER CANCELLED') {
        navigation.navigate('yourTrades', {})
        return
      }
      if (error !== 'UNAUTHORIZED' && typeof error === 'string') {
        updateMessage({ msgKey: error, level: 'ERROR' })
      }
    }
  }, [error, navigation, updateMessage])

  useRefetchOnNotification(refetch, offer.id)

  return matches
}
