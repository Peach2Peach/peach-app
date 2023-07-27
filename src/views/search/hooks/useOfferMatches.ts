import { useMemo } from 'react'
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useIsFocused } from '@react-navigation/native'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { isBuyOffer } from '../../../utils/offer'
import { error, info } from '../../../utils/log'
import { getMatches } from '../../../utils/peachAPI'
import { FIFTEEN_SECONDS } from '../../../constants'

const PAGESIZE = 10
const matchesKeys = {
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

  const queryData = useInfiniteQuery({
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
  const [result, err] = await getMatches({
    offerId,
    page: pageParam,
    size: PAGESIZE,
    timeout: 30 * 1000,
    sortBy,
  })

  if (result) {
    info('matches: ', result.matches.length)
    return result
  } else if (err) {
    error('Error', err)
    throw err
  }
  throw new Error()
}
