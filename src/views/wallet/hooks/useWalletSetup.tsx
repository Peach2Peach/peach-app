import React, { useMemo } from 'react'
import { Icon } from '../../../components'
import { HelpIcon } from '../../../components/icons'

import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useSyncWallet } from './useSyncWallet'

export const useWalletSetup = () => {
  const walletStore = useWalletState()
  const showHelp = useShowHelp('withdrawingFunds')
  const navigation = useNavigation()
  const { refresh, loading } = useSyncWallet()

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

  return {
    walletStore,
    refresh,
    loading,
  }
}
