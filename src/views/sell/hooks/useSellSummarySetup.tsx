import React, { useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { WalletIcon } from '../../../components/icons'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useSellSummarySetup = () => {
  const navigation = useNavigation()
  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )
  const [returnAddress, setReturnAddress] = useState('')
  const walletLabel = peachWalletActive ? i18n('peachWallet') : payoutAddressLabel
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('sell.summary.title'),
        hideGoBackButton: true,
        icons: [
          {
            iconComponent: <WalletIcon />,
            onPress: () => navigation.navigate('selectWallet', { type: 'refund' }),
          },
        ],
      }),
      [navigation],
    ),
  )
  useEffect(() => {
    ;(async () => {
      if (peachWalletActive) {
        setReturnAddress((await peachWallet.getReceivingAddress()) || '')
      } else {
        setReturnAddress(payoutAddress || '')
      }
    })()
  }, [payoutAddress, peachWalletActive])

  useEffect(() => {
    if (!peachWalletActive && !payoutAddress && !payoutAddressLabel) {
      setPeachWalletActive(true)
    }
  }, [payoutAddress, payoutAddressLabel, peachWalletActive, setPeachWalletActive])

  return { returnAddress, walletLabel }
}
