import { useCallback } from 'react'
import { getNavigationDestinationForContract, isContractId } from '../utils/contract'
import { getContract, getOfferDetails } from '../utils/peachAPI'
import { getNavigationDestinationForOffer } from '../views/yourTrades/utils'
import { useNavigation } from './useNavigation'

export const useGoToOfferOrContract = () => {
  const navigation = useNavigation()

  const goToOfferOrContract = useCallback(
    async (id: string) => {
      if (isContractId(id)) {
        const [newContract] = await getContract({ contractId: id })
        if (!newContract) return
        const destination = await getNavigationDestinationForContract(newContract)
        navigation.navigate(...destination)
      } else {
        const [newOffer] = await getOfferDetails({ offerId: id })
        if (!newOffer) return
        const destination = getNavigationDestinationForOffer(newOffer)
        navigation.navigate(...destination)
      }
    },
    [navigation],
  )

  return goToOfferOrContract
}
