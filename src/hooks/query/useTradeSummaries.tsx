import { useCallback, useMemo } from 'react'
import { sortSummariesByDate } from '../../utils/contract'
import { useContractSummaries } from './useContractSummaries'
import { useOfferSummaries } from './useOfferSummaries'

export const useTradeSummaries = (enabled = true) => {
  const { offers, isLoading: offersLoading, error: offersError, refetch: refetchOffers } = useOfferSummaries(enabled)
  const {
    contracts,
    isLoading: contractsLoading,
    error: contractsError,
    refetch: refetchContracts,
  } = useContractSummaries(enabled)

  const refetch = useCallback(() => {
    refetchOffers()
    refetchContracts()
  }, [refetchContracts, refetchOffers])

  const filteredOffers = useMemo(() => offers.filter(({ contractId }) => !contractId), [offers])
  const tradeSummaries = useMemo(
    () => [...filteredOffers, ...contracts].sort(sortSummariesByDate).reverse(),
    [contracts, filteredOffers],
  )

  return {
    isLoading: offersLoading || contractsLoading,
    error: offersError || contractsError,
    tradeSummaries,
    refetch,
  }
}
