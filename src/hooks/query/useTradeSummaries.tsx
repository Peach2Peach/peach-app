import { useCallback } from 'react'
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

  const filteredOffers = offers.filter(({ contractId }) => !contractId)
  const tradeSummaries = [...filteredOffers, ...contracts].sort(sortSummariesByDate).reverse()

  return {
    isLoading: offersLoading || contractsLoading,
    error: offersError || contractsError,
    tradeSummaries,
    refetch,
  }
}
