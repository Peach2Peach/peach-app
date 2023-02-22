import { useCallback } from 'react'
import { useContractSummaries } from './useContractSummaries'
import { useOfferSummaries } from './useOfferSummaries'

export const useTradeSummaries = () => {
  const { offers, isLoading: offersLoading, error: offersError, refetch: refetchOffers } = useOfferSummaries()
  const {
    contracts,
    isLoading: contractsLoading,
    error: contractsError,
    refetch: refetchContracts,
  } = useContractSummaries()

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
