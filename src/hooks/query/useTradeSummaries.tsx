import { useCallback } from 'react'
import { useContractSummaries } from './useContractSummaries'
import { useOfferSummaries } from './useOfferSummaries'

export const useTradeSummaries = (enabled = true) => {
  const { offers, isFetching: offersFetching, error: offersError, refetch: refetchOffers } = useOfferSummaries(enabled)
  const {
    contracts,
    isFetching: contractsFetching,
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
    error: offersError || contractsError,
    refetch,
  }
}
