import { useIsFocused } from '@react-navigation/native'
import { useCallback, useEffect } from 'react'
import { useNavigation, useRoute } from '../../../hooks'
import { useCommonContractSetup } from '../../../hooks/useCommonContractSetup'
import { getNavigationDestinationForContract, shouldRateCounterParty } from '../../../utils/contract'
import { isTradeComplete } from '../../../utils/contract/status'
import { getContract, getOfferDetails } from '../../../utils/peachAPI'
import { getNavigationDestinationForOffer } from '../../yourTrades/utils'
import { useShowHighFeeWarning } from './useShowHighFeeWarning'
import { useShowLowFeeWarning } from './useShowLowFeeWarning'

export const useContractSetup = () => {
  const route = useRoute<'contract'>()
  const { contractId } = route.params
  const isFocused = useIsFocused()
  const { contract, saveAndUpdate, isLoading, view, requiredAction, newOfferId, refetch }
    = useCommonContractSetup(contractId)
  const navigation = useNavigation()
  const shouldShowFeeWarning = view === 'buyer' && !!contract?.paymentMade && !contract?.paymentConfirmed

  useShowHighFeeWarning({ enabled: shouldShowFeeWarning, amount: contract?.amount })
  useShowLowFeeWarning({ enabled: shouldShowFeeWarning })

  useEffect(() => {
    if (!contract || !view || isLoading || !isFocused) return
    if (isTradeComplete(contract) && !contract.disputeWinner && !contract.canceled) {
      if (shouldRateCounterParty(contract, view)) {
        refetch().then(({ data }) => {
          if (data && shouldRateCounterParty(data, view)) navigation.replace('tradeComplete', { contract: data })
        })
      }
    }
  }, [contract, isFocused, isLoading, navigation, refetch, view])

  const goToNewOffer = useCallback(async () => {
    if (!newOfferId) return
    const [newOffer] = await getOfferDetails({ offerId: newOfferId })
    if (newOffer?.contractId) {
      const [newContract] = await getContract({ contractId: newOffer.contractId })
      if (newContract === null) return
      const [screen, params] = await getNavigationDestinationForContract(newContract)
      navigation.replace(screen, params)
    } else {
      navigation.replace(...getNavigationDestinationForOffer(newOffer))
    }
  }, [newOfferId, navigation])

  return {
    contract,
    saveAndUpdate,
    isLoading,
    view,
    requiredAction,
    hasNewOffer: !!newOfferId,
    goToNewOffer,
  }
}
