import { useState } from 'react'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useSyncWallet = () => {
  const [loading, setLoading] = useState(!peachWallet.synced)

  const refresh = async () => {
    if (loading) return
    setLoading(true)
    await peachWallet.syncWallet()
    setLoading(false)
  }

  return { refresh, loading }
}
