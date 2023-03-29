import { useQuery } from '@tanstack/react-query'
import { shallow } from 'zustand/shallow'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { getOfferSummaries } from '../../utils/peachAPI'

const getOfferSummariesQuery = async () => {
  const [offers, error] = await getOfferSummaries({})

  if (error) throw new Error(error.error)
  return offers || []
}

export const useOfferSummaries = (enabled = true) => {
  const [offers, setOffers, getLastModified] = useTradeSummaryStore(
    (state) => [state.offers, state.setOffers, state.getLastModified],
    shallow,
  )
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['offerSummaries'],
    queryFn: getOfferSummariesQuery,
    enabled,
    initialData: offers,
    initialDataUpdatedAt: getLastModified().getTime(),
    onSuccess: (result) => {
      setOffers(result)
    },
  })

  return { offers: data, isLoading, error, refetch }
}
