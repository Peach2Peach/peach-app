import { useQuery } from '@tanstack/react-query'
import { getOfferDetails } from '../utils/peachAPI'

const getOfferQuery = async ({ queryKey }: { queryKey: [string, string] }): Promise<BuyOffer> => {
  const [, offerId] = queryKey
  const [offer] = await getOfferDetails({ offerId })

  return offer as BuyOffer
}

type OfferDetailsQueryResponse = {
  offer?: BuyOffer
  isLoading: boolean
  error: unknown
}
export const useOfferDetailsQuery = (id: string): OfferDetailsQueryResponse => {
  const { data, isLoading, error } = useQuery(['offer', id], getOfferQuery)

  return { offer: data, isLoading, error }
}
