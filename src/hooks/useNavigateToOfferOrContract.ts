import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { ContractSummary } from '../../peach-api/src/@types/contract'
import { OfferSummary } from '../../peach-api/src/@types/offer'
import { useStartRefundPopup } from '../popups/useStartRefundPopup'
import { isSellOffer } from '../utils/offer/isSellOffer'
import { peachAPI } from '../utils/peachAPI'
import { isContractSummary } from '../views/yourTrades/utils/isContractSummary'
import { getNavigationDestinationForOffer } from '../views/yourTrades/utils/navigation/getNavigationDestinationForOffer'
import { useNavigation } from './useNavigation'

export const useNavigateToOfferOrContract = (item: OfferSummary | ContractSummary) => {
  const navigation = useNavigation()
  const showStartRefundPopup = useStartRefundPopup()
  const queryClient = useQueryClient()

  const navigateToOfferOrContract = useCallback(async () => {
    const destination = isContractSummary(item)
      ? (['contract', { contractId: item.id }] as const)
      : getNavigationDestinationForOffer(item)
    if (item.tradeStatus === 'refundTxSignatureRequired') {
      const offerId = isContractSummary(item) ? item.offerId : item.id
      const { result: sellOffer } = await peachAPI.private.offer.getOfferDetails({ offerId })
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
