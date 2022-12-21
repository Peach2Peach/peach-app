import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMatchStore } from '../../../components/matches/store'
import { useRoute } from '../../../hooks'
import { getMatchesFn } from '../getMatches'

const FIFTEEN_SECONDS = 15 * 1000

export const useOfferMatches = () => {
  const { offer } = useRoute<'search'>().params
  const currentPage = useMatchStore((state) => state.currentPage)

  const queryData = useInfiniteQuery(['matches', offer.id || ''], getMatchesFn, {
    refetchInterval: FIFTEEN_SECONDS,
    enabled: !!offer.id && !offer.doubleMatched && (offer.type !== 'ask' || offer.funding?.status === 'FUNDED'),
    getNextPageParam: (lastPage) => (lastPage?.remainingMatches > 0 ? currentPage + 1 : undefined),
    keepPreviousData: true,
  })

  const allMatches = useMemo(
    () => [...(queryData.data?.pages || [])].flatMap((page) => page.matches),
    [queryData.data?.pages],
  )

  return { ...queryData, allMatches }
}
