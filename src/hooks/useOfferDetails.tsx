import { useQuery } from '@tanstack/react-query'
import { getOfferDetails } from '../utils/peachAPI'

const getOfferQuery = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, offerId] = queryKey
  const [offer] = await getOfferDetails({ offerId })

  return offer
}

export const useOfferDetails = (id: string) => {
  const { data, isLoading, error } = useQuery(['offer', id], getOfferQuery)

  return { offer: data, isLoading, error }
}
