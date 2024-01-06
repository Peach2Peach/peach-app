import { QueryFunction, useQueries, useQuery } from '@tanstack/react-query'
import { MSINAMINUTE } from '../../constants'
import { error } from '../../utils/log/error'
import { getOffer } from '../../utils/offer/getOffer'
import { saveOffer } from '../../utils/offer/saveOffer'
import { peachAPI } from '../../utils/peachAPI'

const getOfferQuery: QueryFunction<BuyOffer | SellOffer> = async ({ queryKey }) => {
  const [, offerId] = queryKey as string[]
  const { result: offer, error: err } = await peachAPI.private.offer.getOfferDetails({ offerId })

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
const buildQuery = (id: string) => {
  const initialOffer = getOffer(id)

  return {
    queryKey: ['offer', id],
    queryFn: getOfferQuery,
    initialData: initialOffer,
    initialDataUpdatedAt: initialOffer?.lastModified?.getTime(),
    staleTime: MSINAMINUTE,
    enabled: !!id,
  }
}

export const useOfferDetails = (id: string) => {
  const { data, isLoading, isFetching, error: offerDetailsError } = useQuery(buildQuery(id))

  return { offer: data, isLoading, isFetching, error: offerDetailsError }
}

export const useMultipleOfferDetails = (ids: string[]) => {
  const queries = useQueries({ queries: ids.map(buildQuery) })

  const isLoading = queries.some((query) => query.isLoading)
  const isFetching = queries.some((query) => query.isFetching)
  const errors = queries.map((query) => query.error)
  const offers = queries.map((query) => query.data)

  return { offers, isLoading, isFetching, errors }
}
