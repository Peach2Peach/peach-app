import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useStartRefundPopup } from '../popups/useStartRefundPopup'
import { getNavigationDestinationForContract } from '../utils/contract'
import { isSellOffer } from '../utils/offer'
import { getOfferDetails } from '../utils/peachAPI'
import { getNavigationDestinationForOffer, isContractSummary } from '../views/yourTrades/utils'
import { useNavigation } from './useNavigation'

export const useNavigateToOfferOrContract = (item: TradeSummary) => {
  const navigation = useNavigation()
  const showStartRefundPopup = useStartRefundPopup()
  const queryClient = useQueryClient()

  const navigateToOfferOrContract = useCallback(async () => {
    const destination = isContractSummary(item)
      ? getNavigationDestinationForContract(item)
      : getNavigationDestinationForOffer(item)
    if (item.tradeStatus === 'refundTxSignatureRequired') {
      const offerId = isContractSummary(item) ? item.offerId : item.id
      const [sellOffer] = await getOfferDetails({ offerId })
      if (sellOffer && isSellOffer(sellOffer)) {
        queryClient.setQueryData(['offer', sellOffer.id], sellOffer)
        showStartRefundPopup(sellOffer)
        return
      }
    }

    navigation.navigate(...destination)
  }, [item, navigation, queryClient, showStartRefundPopup])

  return navigateToOfferOrContract
}
