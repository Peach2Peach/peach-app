import { useState } from 'react'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useSyncWallet = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refresh = async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    await peachWallet.syncWallet()
    setIsRefreshing(false)
  }

  return { refresh, isRefreshing }
}
