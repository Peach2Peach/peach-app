import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMatchStore } from '../../../components/matches/store'
import { getMatchesFn } from '../getMatches'
import shallow from 'zustand/shallow'

const FIFTEEN_SECONDS = 15 * 1000

export const useOfferMatches = () => {
  const [offer, currentPage] = useMatchStore((state) => [state.offer, state.currentPage], shallow)

  const queryData = useInfiniteQuery(['matches', offer.id || ''], getMatchesFn, {
    refetchInterval: FIFTEEN_SECONDS,
    enabled: !!offer.id && !offer.doubleMatched && (offer.type !== 'ask' || offer.funding?.status === 'FUNDED'),
    getNextPageParam: (lastPage) => (lastPage?.remainingMatches > 0 ? currentPage + 1 : undefined),
    keepPreviousData: true,
  })

  const allMatches = useMemo(
    () => (queryData.data?.pages || []).flatMap((page) => page.matches),
    [queryData.data?.pages],
  )

  return { ...queryData, allMatches }
}
