import { useQuery } from '@tanstack/react-query'
import { error } from '../../utils/log'
import { getOffer, saveOffer } from '../../utils/offer'
import { getOfferDetails } from '../../utils/peachAPI'

export const getOfferQuery = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, offerId] = queryKey
  if (!offerId) return undefined

  const [offer, err] = await getOfferDetails({ offerId })
  if (err) {
    error('Could not fetch offer information for offer', offerId, err.error)
    throw new Error(err.error)
  }
  if (offer) saveOffer(offer)
  return offer
}

export const useOfferDetails = (id: string) => {
  const initialOffer = getOffer(id)
  const {
    data,
    isLoading,
    error: offerDetailsError,
  } = useQuery({
    queryKey: ['offer', id],
    queryFn: getOfferQuery,
    initialData: initialOffer,
    initialDataUpdatedAt: initialOffer?.lastModified?.getTime(),
    enabled: !!id,
  })

  return { offer: data, isLoading, error: offerDetailsError }
}
