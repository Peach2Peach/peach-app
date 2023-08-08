import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { MSINASECOND } from '../../../constants'
import { useNavigation, useValidatedState } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useSyncWallet } from './useSyncWallet'
import { useWalletHeaderSetup } from './useWalletHeaderSetup'

const bitcoinAddressRules = { required: false, bitcoinAddress: true }

export const useWalletSetup = ({ syncOnLoad = true }) => {
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

  const [address, setAddress, isValid, addressErrors] = useValidatedState<string>('', bitcoinAddressRules)
  const canWithdrawAll = balance > 0 && !!address && isValid

  const syncWalletOnLoad = useCallback(async () => {
    if (!peachWallet.initialized) {
      setTimeout(syncWalletOnLoad, MSINASECOND)
      return
    }
    setWalletLoading(peachWallet.transactions.length === 0)
    await peachWallet.syncWallet()
    setWalletLoading(false)
  }, [])

  useWalletHeaderSetup(walletLoading)

  useFocusEffect(
    useCallback(() => {
      if (syncOnLoad) syncWalletOnLoad()
    }, [syncOnLoad, syncWalletOnLoad]),
  )

  return {
    balance,
    refresh,
    isRefreshing,
    address,
    setAddress,
    addressErrors,
    canWithdrawAll,
    walletLoading,
  }
}
