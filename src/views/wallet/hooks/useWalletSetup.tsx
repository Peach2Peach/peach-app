import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
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
    if (!peachWallet.initialized) return
    setWalletLoading(peachWallet.transactions.length === 0)

    await refresh()
    setWalletLoading(false)
    // adding refresh or peachWallet.transactions.length as dependencies causes an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peachWallet.initialized])

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
