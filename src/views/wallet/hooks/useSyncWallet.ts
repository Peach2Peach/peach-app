import { useState } from 'react'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useSyncWallet = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refresh = () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    peachWallet.syncWallet(() => setIsRefreshing(false))
  }

  return { refresh, isRefreshing }
}
