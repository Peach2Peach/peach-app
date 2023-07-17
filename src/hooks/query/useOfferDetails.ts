import { useQuery } from '@tanstack/react-query'
import { MSINAMINUTE } from '../../constants'
import { error } from '../../utils/log'
import { getOffer, saveOffer } from '../../utils/offer'
import { getOfferDetails } from '../../utils/peachAPI'

const getOfferQuery = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, offerId] = queryKey
  const [offer, err] = await getOfferDetails({ offerId })

  if (err) {
    error('Could not fetch offer information for offer', offerId, err.error)
    throw new Error(err.error)
  }
  if (!offer) {
    throw new Error('NOT_FOUND')
  }
  saveOffer(offer)
  return offer
}

export const useOfferDetails = (id: string) => {
  const initialOffer = getOffer(id)
  const {
    data,
    isLoading,
    isFetching,
    error: offerDetailsError,
  } = useQuery({
    queryKey: ['offer', id],
    queryFn: getOfferQuery,
    initialData: initialOffer,
    initialDataUpdatedAt: initialOffer?.lastModified?.getTime(),
    staleTime: MSINAMINUTE,
    enabled: !!id,
  })

  return { offer: data, isLoading, isFetching, error: offerDetailsError }
}
