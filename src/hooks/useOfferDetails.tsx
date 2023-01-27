import { useQuery } from '@tanstack/react-query'
import { getOfferDetails } from '../utils/peachAPI'

const getOfferQuery = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, offerId] = queryKey
  if (!offerId) return null

  const [offer] = await getOfferDetails({ offerId })

  return offer
}

export const useOfferDetails = (id: string) => {
  const { data, isLoading, error } = useQuery(['offer', id], getOfferQuery)
  console.log(id, !!data)
  return { offer: data, isLoading, error }
}
