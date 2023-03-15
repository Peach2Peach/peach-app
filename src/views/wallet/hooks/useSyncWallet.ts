import { useState } from 'react'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useSyncWallet = () => {
  const [refreshing, setRefreshing] = useState(!peachWallet.synced)

  const refresh = async () => {
    if (refreshing) return
    setRefreshing(true)
    await peachWallet.syncWallet()
    setRefreshing(false)
  }

  return { refresh, refreshing }
}
