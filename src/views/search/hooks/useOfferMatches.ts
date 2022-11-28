import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { error, info } from '../../../utils/log'
import { getMatches } from '../../../utils/peachAPI'
import { useMatchStore } from '../../../components/matches/store'
import { useRoute } from '../../../hooks'

const PAGESIZE = 10
const FIFTEEN_SECONDS = 15 * 1000

const getMatchesFn = async ({ queryKey, pageParam = 0 }: { queryKey: [string, string]; pageParam?: number }) => {
  const [, offerId] = queryKey

  info('Checking matches for', offerId)
  const [result, err] = await getMatches({
    offerId,
    page: pageParam,
    size: PAGESIZE,
    timeout: 30 * 1000,
  })

  if (result) {
    info('matches: ', result.matches.length)
    return result
  } else if (err) {
    error('Error', err)
    throw new Error(err.error)
  }
  throw new Error()
}

export const useOfferMatches = () => {
  const { offer } = useRoute<'search'>().params
  const currentPage = useMatchStore((state) => state.currentPage)

  const queryData = useInfiniteQuery(['matches', offer.id || ''], getMatchesFn, {
    refetchInterval: FIFTEEN_SECONDS,
    enabled: !!offer.id && !offer.doubleMatched && (offer.type !== 'ask' || offer.funding?.status === 'FUNDED'),
    // below functionality not yet implemented
    getNextPageParam: (lastPage) => (lastPage?.hasMoreMatches ? currentPage + 1 : undefined),
    keepPreviousData: true,
  })

  const allMatches = useMemo(
    () => [...(queryData.data?.pages || [])].flatMap((page) => page.matches),
    [queryData.data?.pages],
  )

  return { ...queryData, allMatches }
}
