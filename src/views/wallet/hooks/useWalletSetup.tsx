import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useContext, useMemo, useState } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import { useHeaderSetup, useNavigation, useValidatedState } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { WithdrawalConfirmation } from '../../../overlays/WithdrawalConfirmation'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { getFeeEstimate } from '../../../utils/peachAPI'
import { parseError } from '../../../utils/result'
import { isNumber } from '../../../utils/validation'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { InsufficientFundsError } from '../../../utils/wallet/types'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { parseBroadcastError } from '../helpers/parseBroadcastError'
import { useSyncWallet } from './useSyncWallet'

const bitcoinAddressRules = { required: false, bitcoinAddress: true }

export const useWalletSetup = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const showErrorBanner = useShowErrorBanner()
  const feeRate = useSettingsStore((state) => state.feeRate)
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

  const closeOverlay = useMemo(() => () => updateOverlay({ visible: false }), [updateOverlay])

  const [address, setAddress, isValid, addressErrors] = useValidatedState<string>('', bitcoinAddressRules)

  const onChange = useCallback(
    (value: string) => {
      setAddress(value)
    },
    [setAddress],
  )

  const confirmWithdrawal = async () => {
    closeOverlay()
    let finalFeeRate = feeRate
    if (feeRate && !isNumber(feeRate)) {
      const [estimatedFees] = await getFeeEstimate({})
      if (estimatedFees) finalFeeRate = estimatedFees[feeRate]
    }

    if (!isNumber(finalFeeRate)) {
      showErrorBanner()
      return
    }

    try {
      const txId = await peachWallet.withdrawAll(address, finalFeeRate)
      if (txId) setAddress('')
    } catch (e) {
      const [err, cause] = e as [Error, string | InsufficientFundsError]
      const error = parseError(err)
      const bodyArgs = parseBroadcastError(err, cause)
      showErrorBanner(error, bodyArgs)
    }
  }

  const openWithdrawalConfirmation = () =>
    updateOverlay({
      title: i18n('wallet.confirmWithdraw.title'),
      content: <WithdrawalConfirmation />,
      visible: true,
      action2: {
        callback: closeOverlay,
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
    setWalletLoading(peachWallet.allTransactions.length === 0)
    await peachWallet.syncWallet(() => setWalletLoading(false))
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
    onChange,
    isValid,
    address,
    setAddress,
    addressErrors,
    openWithdrawalConfirmation,
    confirmWithdrawal,
    walletLoading,
  }
}
