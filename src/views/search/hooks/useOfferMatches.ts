import { useContext, useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { error, info } from '../../../utils/log'
import { getMatches } from '../../../utils/peachAPI'
import { MessageContext } from '../../../contexts/message'
import useRefetchOnNotification from './useRefetchOnNotification'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useNavigation } from '../../../hooks/useNavigation'
import { useMatchStore } from '../../../components/matches/store'
import { useSearchRoute } from '../../../components/matches/hooks'

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
  const [, updateMessage] = useContext(MessageContext)
  const { offer } = useSearchRoute().params
  const navigation = useNavigation()
  const currentPage = useMatchStore((state) => state.currentPage)

  const { isLoading, data, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery(
    ['matches', offer.id || ''],
    getMatchesFn,
    {
      refetchInterval: FIFTEEN_SECONDS,
      enabled: !!offer.id && !offer.doubleMatched && (offer.type !== 'ask' || offer.funding?.status === 'FUNDED'),
      onError: (requestError) => {
        if (requestError === 'OFFER EXPIRED' || requestError === 'OFFER CANCELLED') {
          navigation.navigate('yourTrades', {})
          return
        }
        if (requestError !== 'UNAUTHORIZED' && typeof requestError === 'string') {
          updateMessage({ msgKey: requestError, level: 'ERROR' })
        }
      },
      onSuccess: (result) => {

        /* if (result?.contractId) {
        info('Search.tsx - getOfferDetailsEffect', `navigate to contract ${result.contractId}`)
        navigation.replace('contract', { contractId: result.contractId })
      } */
      },
      getNextPageParam: (lastPage) => (lastPage?.hasMoreMatches ? currentPage + 1 : undefined),
      keepPreviousData: true,
    },
  )

  useRefetchOnNotification(refetch, offer.id)

  const allMatches = useMemo(() => [...(data?.pages || [])].flatMap((page) => page.matches), [data?.pages])

  return { isLoading, allMatches, fetchNextPage, hasNextPage, isFetchingNextPage }
}
