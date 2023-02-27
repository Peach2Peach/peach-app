import { useCallback } from 'react'
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

  return {
    offers,
    contracts,
    isLoading: offersLoading || contractsLoading,
    error: offersError || contractsError,
    refetch,
  }
}
