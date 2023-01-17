import { useQuery } from '@tanstack/react-query'
import { getOfferDetails } from '../utils/peachAPI'

const getOfferQuery = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, offerId] = queryKey
  const [offer] = await getOfferDetails({ offerId })

  return offer
}

type OfferDetailsQueryResponse<T> = {
  offer: T | null
  isLoading: boolean
  error: unknown
}
export const useOfferDetailsQuery = <T = BuyOffer | SellOffer, >(id: string): OfferDetailsQueryResponse<T> => {
  const { data, isLoading, error } = useQuery(['offer', id], getOfferQuery)

  return { offer: data as T | null, isLoading, error }
}
