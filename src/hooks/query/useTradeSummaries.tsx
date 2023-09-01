import { useCallback } from 'react'
import { sortContractsByDate } from '../../utils/contract'
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

  const filteredOffers = offers.filter(({ contractId }) => !contractId)
  const tradeSummaries = [...filteredOffers, ...contracts].sort(sortContractsByDate).reverse()

  return {
    isFetching: offersFetching || contractsFetching,
    isLoading: offersLoading || contractsLoading,
    error: offersError || contractsError,
    tradeSummaries,
    refetch,
  }
}
