import { useQuery } from '@tanstack/react-query'
import { shallow } from 'zustand/shallow'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { peachAPI } from '../../utils/peachAPI'

const getOfferSummariesQuery = async () => {
  const { result: offers, error } = await peachAPI.private.offer.getOfferSummaries()

  if (error?.error || !offers) throw new Error(error?.error || 'Unable to fetch offers')
  return offers.map((offer) => ({
    ...offer,
    creationDate: new Date(offer.creationDate),
    lastModified: new Date(offer.lastModified),
  }))
}

export const useOfferSummaries = (enabled = true) => {
  const [offers, setOffers, lastModified] = useTradeSummaryStore(
    (state) => [state.offers, state.setOffers, state.lastModified],
    shallow,
  )
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['offerSummaries'],
    queryFn: getOfferSummariesQuery,
    enabled,
    initialData: offers.length ? offers : undefined,
    initialDataUpdatedAt: lastModified.getTime?.(),
    onSuccess: setOffers,
  })

  return { offers: data || [], isLoading, error, refetch }
}
