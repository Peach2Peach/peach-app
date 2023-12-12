import { useIsFocused } from '@react-navigation/native'
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { GetMatchesResponseBody } from '../../../../peach-api/src/@types/api/offerAPI'
import { FIFTEEN_SECONDS } from '../../../constants'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { getAbortWithTimeout } from '../../../utils/getAbortWithTimeout'
import { info } from '../../../utils/log'
import { isBuyOffer } from '../../../utils/offer/isBuyOffer'
import { peachAPI } from '../../../utils/peachAPI'

const PAGESIZE = 10
export const matchesKeys = {
  matches: ['matches'] as const,
  matchesByOfferId: (offerId: string) => [...matchesKeys.matches, offerId] as const,
  sortedMatchesByOfferId: (offerId: string, sortBy: Sorter[]) =>
    [...matchesKeys.matchesByOfferId(offerId), sortBy] as const,
}

export const useOfferMatches = (offerId: string, enabled = true) => {
  const { offer } = useOfferDetails(offerId)
  const isFocused = useIsFocused()
  const sortBy: Sorter[] = useOfferPreferences((state) =>
    !offer ? ['bestReputation'] : isBuyOffer(offer) ? state.sortBy.buyOffer : state.sortBy.sellOffer,
  )

  const queryData = useInfiniteQuery<
    GetMatchesResponseBody,
    APIError,
    GetMatchesResponseBody,
    ReturnType<typeof matchesKeys.sortedMatchesByOfferId>
  >({
    queryKey: matchesKeys.sortedMatchesByOfferId(offerId, sortBy),
    queryFn: getMatchesFn,
    refetchInterval: FIFTEEN_SECONDS,
    enabled: enabled && isFocused && !!offer?.id && !offer.doubleMatched,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    keepPreviousData: true,
  })

  const allMatches = useMemo(
    () => (queryData.data?.pages || []).flatMap((page) => page.matches),
    [queryData.data?.pages],
  )

  return { ...queryData, allMatches }
}

async function getMatchesFn ({
  queryKey: [, offerId, sortBy],
  pageParam = 0,
}: QueryFunctionContext<ReturnType<typeof matchesKeys.sortedMatchesByOfferId>>) {
  info('Checking matches for', offerId)
  const { result, error: err } = await peachAPI.private.offer.getMatches({
    offerId,
    page: pageParam,
    size: PAGESIZE,
    signal: getAbortWithTimeout(30 * 1000).signal,
    sortBy,
  })

  if (result) {
    info('matches: ', result.matches.length)
    return result
  } else if (err) {
    throw err
  }
  throw new Error()
}
