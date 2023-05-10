import { useQuery } from '@tanstack/react-query'
import { shallow } from 'zustand/shallow'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { getOfferSummaries } from '../../utils/peachAPI'

const getOfferSummariesQuery = async () => {
  const [offers, error] = await getOfferSummaries({})

  if (error || !offers) throw new Error(error?.error)
  return offers
}

export const useOfferSummaries = (enabled = true) => {
  const [offers, setOffers, lastModified] = useTradeSummaryStore(
    (state) => [state.offers, state.setOffers, state.lastModified],
    shallow,
  )
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['offerSummaries'],
    queryFn: getOfferSummariesQuery,
    enabled,
    refetchOnMount: true,
    initialData: offers,
    initialDataUpdatedAt: lastModified.getTime(),
    onSuccess: setOffers,
  })

  return { offers: data, isLoading, isFetching, error, refetch }
}
