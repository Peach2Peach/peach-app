import { useContext, useEffect } from 'react'
import { MessageContext } from '../../../contexts/message'
import { useNavigation, useRoute } from '../../../hooks'
import { info } from '../../../utils/log'
import { useOfferMatches } from './useOfferMatches'
import useRefetchOnNotification from './useRefetchOnNotification'

export const useSearchSetup = () => {
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)
  const { offer } = useRoute<'search'>().params
  const { allMatches: matches, error, refetch } = useOfferMatches()

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
