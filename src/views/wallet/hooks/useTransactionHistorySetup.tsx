import { useMemo } from 'react'

import { useHeaderSetup, useNavigation } from '../../../hooks'
import i18n from '../../../utils/i18n'
import { useWalletState } from '../../../utils/wallet/walletStore'

export const useTransactionHistorySetup = () => {
  const navigation = useNavigation()
  const walletStore = useWalletState()
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('wallet.transactionHistory'),
      }),
      [],
    ),
  )

  return {
    navigation,
    walletStore,
  }
}
