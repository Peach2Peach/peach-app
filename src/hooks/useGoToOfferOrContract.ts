import { useCallback } from 'react'
import { isContractId } from '../utils/contract/isContractId'
import { peachAPI } from '../utils/peachAPI'
import { getNavigationDestinationForOffer } from '../views/yourTrades/utils'
import { useNavigation } from './useNavigation'

export const useGoToOfferOrContract = () => {
  const navigation = useNavigation()

  const goToOfferOrContract = useCallback(
    async (id: string) => {
      if (isContractId(id)) {
        navigation.navigate('contract', { contractId: id })
      } else {
        const { result: newOffer } = await peachAPI.private.offer.getOfferDetails({ offerId: id })
        if (!newOffer) return
        const destination = getNavigationDestinationForOffer(newOffer)
        navigation.navigate(...destination)
      }
    },
    [navigation],
  )

  return goToOfferOrContract
}
