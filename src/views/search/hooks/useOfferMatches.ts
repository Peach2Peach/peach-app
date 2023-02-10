import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMatchStore } from '../../../components/matches/store'
import { getMatchesFn } from '../getMatches'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useIsFocused } from '@react-navigation/native'

const FIFTEEN_SECONDS = 15 * 1000

export const useOfferMatches = (offerId: string) => {
  const { offer } = useOfferDetails(offerId)
  const currentPage = useMatchStore((state) => state.currentPage)
  const isFocused = useIsFocused()

  const queryData = useInfiniteQuery<GetMatchesResponse, APIError, GetMatchesResponse, [string, string]>(
    ['matches', offerId],
    getMatchesFn,
    {
      refetchInterval: FIFTEEN_SECONDS,
      enabled:
        isFocused && !!offer?.id && !offer.doubleMatched && (offer.type !== 'ask' || offer.funding?.status === 'FUNDED'),
      getNextPageParam: (lastPage) => (lastPage?.remainingMatches > 0 ? currentPage + 1 : undefined),
      keepPreviousData: true,
    },
  )

  const allMatches = useMemo(
    () => (queryData.data?.pages || []).flatMap((page) => page.matches),
    [queryData.data?.pages],
  )

  return { ...queryData, allMatches }
}
