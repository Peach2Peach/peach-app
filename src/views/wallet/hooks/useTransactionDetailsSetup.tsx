import { NETWORK } from '@env'
import { useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useBitcoinStore } from '../../../store/bitcoinStore'
import { sort } from '../../../utils/array'
import { showTransaction } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'
import { getTx } from '../../../utils/peachAPI'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getTxSummary } from '../helpers/getTxSummary'
import { useSyncWallet } from './useSyncWallet'

export const useTransactionDetailsSetup = () => {
  const { txId } = useRoute<'transactionDetails'>().params
  const navigation = useNavigation()
  const [currency, satsPerUnit] = useBitcoinStore((state) => [state.currency, state.satsPerUnit], shallow)
  const walletStore = useWalletState((state) => state)
  const [transaction, setTransaction] = useState<TransactionSummary>()
  const [receivingAddress, setReceivingAddress] = useState<string>()
  const { refresh, isRefreshing } = useSyncWallet()

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('wallet.transactionDetails'),
      }),
      [],
    ),
  )

  const openInExplorer = () => {
    if (transaction) showTransaction(transaction.id as string, NETWORK)
  }

  const goToBumpNetworkFees = () => {
    navigation.navigate('bumpNetworkFees', { txId })
  }

  useEffect(() => {
    ;(async () => {
      const [result] = await getTx({ txId })
      const output = result?.vout.sort(sort('value')).pop()
      if (output) setReceivingAddress(output.scriptpubkey_address)
    })()
  }, [txId])

  useEffect(() => {
    const tx = walletStore.getTransaction(txId)
    if (!tx) return

    setTransaction(getTxSummary(tx))
  }, [currency, satsPerUnit, txId, walletStore, walletStore.txOfferMap])

  useEffect(() => {
    peachWallet.syncWallet()
  }, [])

  return {
    transaction,
    receivingAddress,
    openInExplorer,
    refresh,
    isRefreshing,
    goToBumpNetworkFees,
  }
}
