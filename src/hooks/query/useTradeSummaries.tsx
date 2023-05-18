import { useCallback } from 'react'
import { useContractSummaries } from './useContractSummaries'
import { useOfferSummaries } from './useOfferSummaries'

export const useTradeSummaries = (enabled = true) => {
  const {
    offers,
    isFetching: offersFetching,
    isLoading: offersLoading,
    error: offersError,
    refetch: refetchOffers,
  } = useOfferSummaries(enabled)
  const {
    contracts,
    isFetching: contractsFetching,
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
    isFetching: offersFetching || contractsFetching,
    isLoading: offersLoading || contractsLoading,
    error: offersError || contractsError,
    refetch,
  }
}
