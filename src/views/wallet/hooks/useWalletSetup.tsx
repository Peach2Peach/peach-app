import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { MSINASECOND } from '../../../constants'
import { useNavigation } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useSyncWallet } from './useSyncWallet'

type Props = {
  peachWallet: PeachWallet
  syncOnLoad: boolean
}
export const useWalletSetup = ({ peachWallet, syncOnLoad }: Props) => {
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

    await refresh()
    setWalletLoading(false)
  }, [peachWallet])

  useFocusEffect(
    useCallback(() => {
      console.log('weird flex')

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
