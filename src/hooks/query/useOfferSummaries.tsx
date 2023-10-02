import { useQuery } from '@tanstack/react-query'
import { shallow } from 'zustand/shallow'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { peachAPI } from '../../utils/peachAPI'

const getOfferSummariesQuery = async () => {
  const { result: offers, error } = await peachAPI.private.offer.getOfferSummaries()

  if (error || !offers) throw new Error(error?.error || 'Unable to fetch offer summaries')
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
    initialData: offers.length ? offers : undefined,
    initialDataUpdatedAt: lastModified.getTime(),
    onSuccess: setOffers,
  })

  return { offers: data || [], isLoading, isFetching, error, refetch }
}
