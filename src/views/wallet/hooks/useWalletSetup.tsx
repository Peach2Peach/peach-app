import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { MSINASECOND } from '../../../constants'
import { useNavigation } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useSyncWallet } from './useSyncWallet'

export const useWalletSetup = (syncOnLoad = true) => {
  const balance = useWalletState((state) => state.balance)

  const navigation = useNavigation()
  const { refresh, isRefreshing } = useSyncWallet()
  const [walletLoading, setWalletLoading] = useState(false)
  const [shouldShowBackupOverlay, showBackupReminder, setShowBackupReminder] = useSettingsStore((state) => [
    state.shouldShowBackupOverlay,
    state.showBackupReminder,
    state.setShowBackupReminder,
  ])

  if (!showBackupReminder && balance > 0 && shouldShowBackupOverlay) {
    setShowBackupReminder(true)
    navigation.navigate('backupTime', { nextScreen: 'wallet' })
  }

  const syncWalletOnLoad = useCallback(async () => {
    if (!peachWallet.initialized) {
      setTimeout(syncWalletOnLoad, MSINASECOND)
      return
    }
    setWalletLoading(peachWallet.transactions.length === 0)
    await peachWallet.syncWallet()
    setWalletLoading(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (syncOnLoad) syncWalletOnLoad()
    }, [syncOnLoad, syncWalletOnLoad]),
  )

  return {
    balance,
    isRefreshing,
    walletLoading,
    refresh,
  }
}
