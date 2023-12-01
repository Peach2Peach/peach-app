import { useCallback } from 'react'
import { getNavigationDestinationForContract, isContractId } from '../utils/contract'
import { peachAPI } from '../utils/peachAPI'
import { getNavigationDestinationForOffer } from '../views/yourTrades/utils'
import { useNavigation } from './useNavigation'

export const useGoToOfferOrContract = () => {
  const navigation = useNavigation()

  const goToOfferOrContract = useCallback(
    async (id: string) => {
      if (isContractId(id)) {
        const { result: newContract } = await peachAPI.private.contract.getContract({ contractId: id })
        if (!newContract) return
        const destination = await getNavigationDestinationForContract(newContract)
        navigation.navigate(...destination)
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
