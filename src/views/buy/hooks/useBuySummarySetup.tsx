import React, { useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { WalletIcon } from '../../../components/icons'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useBuySummarySetup = () => {
  const navigation = useNavigation()
  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )
  const [releaseAddress, setReleaseAddress] = useState('')
  const walletLabel = peachWalletActive ? i18n('peachWallet') : payoutAddressLabel

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('buy.summary.title'),
        icons: [
          {
            iconComponent: <WalletIcon />,
            onPress: () => navigation.navigate('selectWallet', { type: 'payout' }),
          },
        ],
      }),
      [navigation],
    ),
  )

  useEffect(() => {
    ;(async () => {
      if (peachWalletActive) {
        setReleaseAddress((await peachWallet.getReceivingAddress()) || '')
      } else {
        setReleaseAddress(payoutAddress || '')
      }
    })()
  }, [payoutAddress, peachWalletActive])

  useEffect(() => {
    if (!peachWalletActive && !payoutAddress && !payoutAddressLabel) {
      setPeachWalletActive(true)
    }
  }, [payoutAddress, payoutAddressLabel, peachWalletActive, setPeachWalletActive])

  return { releaseAddress, walletLabel }
}
