import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { useHeaderSetup, useNavigation, useValidatedState } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useSyncWallet } from './useSyncWallet'

const bitcoinAddressRules = { required: false, bitcoinAddress: true }

export const useWalletSetup = ({ syncOnLoad = true }) => {
  const balance = useWalletState((state) => state.balance)
  const showHelp = useShowHelp('withdrawingFunds')

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

  const syncWalletOnLoad = async () => {
    setWalletLoading(peachWallet.transactions.length === 0)
    await peachWallet.syncWallet()
    setWalletLoading(false)
  }

  useHeaderSetup(
    walletLoading
      ? {}
      : {
          title: i18n('wallet.title'),
          hideGoBackButton: true,
          icons: [
            {
              ...headerIcons.list,
              accessibilityHint: `${i18n('goTo')} ${i18n('wallet.transactionHistory')}`,
              onPress: () => navigation.navigate('transactionHistory'),
            },
            {
              ...headerIcons.bitcoin,
              accessibilityHint: `${i18n('goTo')} ${i18n('settings.networkFees')}`,
              onPress: () => navigation.navigate('networkFees'),
            },
            { ...headerIcons.help, accessibilityHint: `${i18n('help')}`, onPress: showHelp },
          ],
        },
  )

  useFocusEffect(
    useCallback(() => {
      if (syncOnLoad) syncWalletOnLoad()
    }, [syncOnLoad]),
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
