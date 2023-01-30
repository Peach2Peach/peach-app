import { useQuery } from '@tanstack/react-query'
import { getOfferSummaries } from '../../utils/peachAPI'

const getOfferSummariesQuery = async () => {
  const [offers, error] = await getOfferSummaries({})

  if (error) throw new Error(error.error)
  return offers
}

export const useOfferSummaries = () => {
  const { data, isLoading, error, refetch } = useQuery(['offerSummaries'], getOfferSummariesQuery)

  return { offers: data, isLoading, error, refetch }
}
