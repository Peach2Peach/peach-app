import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { error } from '../../../utils/log/error'
import { parseError } from '../../../utils/result/parseError'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useSyncWallet = () => {
  const queryData = useQuery({
    queryKey: ['syncWallet'],
    queryFn: async () => {
      await peachWallet.syncWallet()
    },
    enabled: peachWallet.initialized,
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
