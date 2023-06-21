import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { useHeaderSetup, useNavigation, useValidatedState } from '../../../hooks'
import { useFeeRate } from '../../../hooks/useFeeRate'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useOpenWithdrawalConfirmationPopup } from './useOpenWithdrawalConfirmationPopup'
import { useSyncWallet } from './useSyncWallet'

const bitcoinAddressRules = { required: false, bitcoinAddress: true }

export const useWalletSetup = (syncOnLoad = true) => {
  const openWithdrawalConfirmationPopup = useOpenWithdrawalConfirmationPopup()
  const feeRate = useFeeRate()
  const walletStore = useWalletState((state) => state)
  const showHelp = useShowHelp('withdrawingFunds')
  const navigation = useNavigation()
  const { refresh, isRefreshing } = useSyncWallet()
  const [walletLoading, setWalletLoading] = useState(false)
  const [shouldShowBackupOverlay, setShouldShowBackupOverlay, setShowBackupReminder] = useSettingsStore((state) => [
    state.shouldShowBackupOverlay.bitcoinReceived,
    state.setShouldShowBackupOverlay,
    state.setShowBackupReminder,
  ])

  if (walletStore.balance > 0 && shouldShowBackupOverlay) {
    setShowBackupReminder(true)
    setShouldShowBackupOverlay('bitcoinReceived', false)
    navigation.navigate('backupTime', { nextScreen: 'wallet' })
  }

  const [address, setAddress, isValid, addressErrors] = useValidatedState<string>('', bitcoinAddressRules)
  const canWithdrawAll = walletStore.balance > 0 && peachWallet.synced && !!address && isValid

  const onSuccess = (txId: string) => {
    if (!txId) return
    setAddress('')
  }

  const openWithdrawalConfirmation = () =>
    openWithdrawalConfirmationPopup({
      address,
      feeRate,
      onSuccess,
    })

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
            label: `${i18n('goTo')} ${i18n('wallet.transactionHistory')}`,
            onPress: () => navigation.navigate('transactionHistory'),
          },
          {
            ...headerIcons.bitcoin,
            label: `${i18n('goTo')} ${i18n('settings.networkFees')}`,
            onPress: () => navigation.navigate('networkFees'),
          },
          { ...headerIcons.help, label: `${i18n('help')}`, onPress: showHelp },
        ],
      },
  )

  useFocusEffect(
    useCallback(() => {
      if (syncOnLoad) syncWalletOnLoad()
    }, [syncOnLoad]),
  )

  return {
    walletStore,
    refresh,
    isRefreshing,
    address,
    setAddress,
    addressErrors,
    openWithdrawalConfirmation,
    canWithdrawAll,
    walletLoading,
  }
}
