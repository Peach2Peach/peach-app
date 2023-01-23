import { NETWORK } from '@env'
import { useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'

import { useHeaderSetup, useRoute } from '../../../hooks'
import { useBitcoinStore } from '../../../store/bitcoinStore'
import { sort } from '../../../utils/array'
import { showTransaction } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'
import { getTx } from '../../../utils/peachAPI'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getTxSummary } from '../helpers/getTxSummary'

export const useTransactionDetailsSetup = () => {
  const route = useRoute<'transactionDetails'>()
  const [currency, satsPerUnit] = useBitcoinStore((state) => [state.currency, state.satsPerUnit], shallow)
  const walletStore = useWalletState()
  const [transaction, setTransaction] = useState<TransactionSummary>()
  const [receivingAddress, setReceivingAddress] = useState<string>()

  const openInExplorer = () => {
    if (transaction) showTransaction(transaction.id as string, NETWORK)
  }

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('wallet.transactionDetails'),
      }),
      [],
    ),
  )

  useEffect(() => {
    ;(async () => {
      const [result] = await getTx({ txId: route.params.txId })
      const output = result?.vout.sort(sort('value')).pop()
      if (output) setReceivingAddress(output.scriptpubkey_address)
    })()
  }, [route])

  useEffect(() => {
    const tx = walletStore.getTransaction(route.params.txId)
    if (!tx) return

    setTransaction(getTxSummary(tx))
  }, [currency, route, satsPerUnit, walletStore, walletStore.txOfferMap])

  return {
    transaction,
    receivingAddress,
    openInExplorer,
  }
}
