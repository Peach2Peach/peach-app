import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { MSINAMINUTE } from '../../../constants'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { error } from '../../../utils/log/error'
import { parseError } from '../../../utils/result/parseError'
import { peachWallet } from '../../../utils/wallet/setWallet'

const MINUTES_OF_STALE_TIME = 10
export const useSyncWallet = ({ refetchInterval }: { refetchInterval?: number } = {}) => {
  const queryData = useQuery({
    queryKey: ['syncWallet'],
    queryFn: async () => {
      await peachWallet.syncWallet()
      return true
    },
    enabled: !!peachWallet?.initialized,
    staleTime: MSINAMINUTE * MINUTES_OF_STALE_TIME,
    refetchInterval,
  })

  const showErrorBanner = useShowErrorBanner()

  useEffect(() => {
    if (queryData.isError) {
      error(parseError(queryData.error))
      showErrorBanner('WALLET_SYNC_ERROR')
    }
  }, [queryData.error, queryData.isError, showErrorBanner])

  return queryData
}
