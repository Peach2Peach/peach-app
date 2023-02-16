import React, { useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { WalletIcon } from '../../../components/icons'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { account, getMessageToSignForAddress } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useBuySummarySetup = () => {
  const navigation = useNavigation()
  const [peachWalletActive, payoutAddress, payoutAddressLabel, payoutAddressSignature] = useSettingsStore(
    (state) => [state.peachWalletActive, state.payoutAddress, state.payoutAddressLabel, state.payoutAddressSignature],
    shallow,
  )
  const [releaseAddress, setReleaseAddress] = useState('')
  const [message, setMessage] = useState('')
  const [messageSignature, setMessageSignature] = useState(
    !peachWalletActive && payoutAddressSignature ? payoutAddressSignature : '',
  )
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
      const address = peachWalletActive ? await peachWallet.getReceivingAddress() : payoutAddress
      if (!address) return

      const messageToSign = getMessageToSignForAddress(account.publicKey, address)
      setReleaseAddress(address)
      setMessage(messageToSign)
      setMessageSignature(
        peachWalletActive ? peachWallet.signMessage(messageToSign, address) : payoutAddressSignature || '',
      )
    })()
  }, [payoutAddress, payoutAddressSignature, peachWalletActive])

  return { releaseAddress, walletLabel, message, messageSignature }
}
