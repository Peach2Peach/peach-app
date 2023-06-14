import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useNavigation, useValidatedState } from '../../../hooks'
import { useFeeRate } from '../../../hooks/useFeeRate'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { useSettingsStore } from '../../../store/settingsStore'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { parseError } from '../../../utils/result'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { InsufficientFundsError } from '../../../utils/wallet/types'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { parseBroadcastError } from '../helpers/parseBroadcastError'
import { useSyncWallet } from './useSyncWallet'

const bitcoinAddressRules = { required: false, bitcoinAddress: true }

export const useWalletSetup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showErrorBanner = useShowErrorBanner()
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

  const confirmWithdrawal = async () => {
    closePopup()

    try {
      const result = await peachWallet.withdrawAll(address, feeRate)
      if (result.txDetails.txid) setAddress('')
    } catch (e) {
      const [err, cause] = e as [Error, string | InsufficientFundsError]
      const error = parseError(err)
      const bodyArgs = parseBroadcastError(err, cause)
      showErrorBanner(error, bodyArgs)
    }
  }

  const openWithdrawalConfirmation = () =>
    setPopup({
      title: i18n('wallet.confirmWithdraw.title'),
      content: <WithdrawalConfirmation />,
      visible: true,
      action2: {
        callback: closePopup,
        label: i18n('cancel'),
        icon: 'xCircle',
      },
      action1: {
        callback: confirmWithdrawal,
        label: i18n('wallet.confirmWithdraw.confirm'),
        icon: 'arrowRightCircle',
      },
      level: 'APP',
    })

  useHeaderSetup(
    useMemo(
      () =>
        walletLoading
          ? {}
          : {
            title: i18n('wallet.title'),
            hideGoBackButton: true,
            icons: [
              { ...headerIcons.list, onPress: () => navigation.navigate('transactionHistory') },
              { ...headerIcons.bitcoin, onPress: () => navigation.navigate('networkFees') },
              { ...headerIcons.help, onPress: showHelp },
            ],
          },
      [navigation, showHelp, walletLoading],
    ),
  )

  const syncWalletOnLoad = async () => {
    setWalletLoading(peachWallet.transactions.length === 0)
    await peachWallet.syncWallet()
    setWalletLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      syncWalletOnLoad()
    }, []),
  )

  return {
    walletStore,
    refresh,
    isRefreshing,
    isValid,
    address,
    setAddress,
    addressErrors,
    openWithdrawalConfirmation,
    confirmWithdrawal,
    walletLoading,
  }
}
