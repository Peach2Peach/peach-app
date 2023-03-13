import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Icon } from '../../../components'
import { HelpIcon } from '../../../components/icons'
import { OverlayContext } from '../../../contexts/overlay'

import { useHeaderSetup, useNavigation, useValidatedState } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { WithdrawalConfirmation } from '../../../overlays/WithdrawalConfirmation'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { getFeeEstimate } from '../../../utils/peachAPI'
import { isNumber } from '../../../utils/validation'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useSyncWallet } from './useSyncWallet'

const bitcoinAddressRules = { required: false, bitcoinAddress: true }

export const useWalletSetup = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const showErrorBanner = useShowErrorBanner()
  const walletStore = useWalletState((state) => state)
  const showHelp = useShowHelp('withdrawingFunds')
  const navigation = useNavigation()
  const { refresh, loading } = useSyncWallet()

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
    let feeRate = account.settings.feeRate
    if (feeRate && !isNumber(feeRate)) {
      const [estimatedFees] = await getFeeEstimate({})
      if (estimatedFees) feeRate = estimatedFees[feeRate]
    }

    if (!isNumber(feeRate)) {
      showErrorBanner()
      return
    }

    const txId = await peachWallet.withdrawAll(address, feeRate)
    if (txId) setAddress('')
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
      () => ({
        title: i18n('wallet.title'),
        hideGoBackButton: true,
        icons: [
          {
            iconComponent: <Icon id="yourTrades" color={tw`text-black-2`.color} />,
            onPress: () => navigation.navigate('transactionHistory'),
          },
          {
            iconComponent: <Icon id="bitcoin" color={tw`text-bitcoin`.color} />,
            onPress: () => navigation.navigate('networkFees'),
          },
          { iconComponent: <HelpIcon />, onPress: showHelp },
        ],
      }),
      [],
    ),
  )

  useFocusEffect(
    useCallback(() => {
      peachWallet.syncWallet()
    }, []),
  )

  return {
    walletStore,
    refresh,
    loading,
    onChange,
    isValid,
    address,
    addressErrors,
    openWithdrawalConfirmation,
  }
}
