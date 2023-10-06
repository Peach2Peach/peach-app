import { useIsFocused } from '@react-navigation/native'
import { useEffect } from 'react'
import { useNavigation, useRoute } from '../../../hooks'
import { useCommonContractSetup } from '../../../hooks/useCommonContractSetup'
import { shouldRateCounterParty } from '../../../utils/contract'
import { isTradeComplete } from '../../../utils/contract/status'
import { useShowHighFeeWarning } from './useShowHighFeeWarning'
import { useShowLowFeeWarning } from './useShowLowFeeWarning'

export const useContractSetup = () => {
  const { contractId } = useRoute<'contract'>().params
  const isFocused = useIsFocused()
  const { contract, saveAndUpdate, isLoading, view, requiredAction, refetch } = useCommonContractSetup(contractId)
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

  return {
    contract,
    saveAndUpdate,
    isLoading,
    view,
    requiredAction,
  }
}
