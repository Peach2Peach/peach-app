import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getMatchesFn } from '../getMatches'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useIsFocused } from '@react-navigation/native'

const FIFTEEN_SECONDS = 15 * 1000

export const useOfferMatches = (offerId: string, enabled = true) => {
  const { offer } = useOfferDetails(offerId)
  const isFocused = useIsFocused()

  const queryData = useInfiniteQuery<GetMatchesResponse, APIError, GetMatchesResponse, [string, string]>({
    queryKey: ['matches', offerId],
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
