import { useCallback, useState } from 'react'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { parseError } from '../../../utils/result'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useSyncWallet = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const showErrorBanner = useShowErrorBanner()
  const refresh = useCallback(
    async (silent = false) => {
      if (isRefreshing) return
      setIsRefreshing(!silent)
      try {
        await peachWallet.syncWallet()
      } catch (e) {
        showErrorBanner(parseError(e))
      } finally {
        setIsRefreshing(false)
      }
    },
    [isRefreshing, showErrorBanner],
  )

  return { refresh, isRefreshing }
}
