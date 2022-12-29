import { useMemo } from 'react'

import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import i18n from '../../../utils/i18n'
import { useWalletState } from '../../../utils/wallet/walletStore'

export const useTransactionDetailsSetup = () => {
  const navigation = useNavigation()
  const route = useRoute<'transactionDetails'>()
  const walletStore = useWalletState()
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('wallet.transactionDetails'),
      }),
      [],
    ),
  )

  return {
    navigation,
    route,
    walletStore,
  }
}
