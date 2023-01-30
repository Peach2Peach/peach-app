import { useQuery } from '@tanstack/react-query'
import { getOfferSummaries } from '../../utils/peachAPI'

const getOfferSummariesQuery = async () => {
  const [offers] = await getOfferSummaries({})

  return offers
}

export const useOfferSummaries = () => {
  const { data, isLoading, error } = useQuery(['offerSummaries'], getOfferSummariesQuery)

  return { offers: data, isLoading, error }
}
