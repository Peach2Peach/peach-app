import { NETWORK } from '@env'
import { useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'

import { useHeaderSetup, useRoute } from '../../../hooks'
import { useBitcoinStore } from '../../../store/bitcoinStore'
import { sort } from '../../../utils/array'
import { showTransaction } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'
import { getOffer } from '../../../utils/offer'
import { getTx } from '../../../utils/peachAPI'
import { getTransactionType, txIsConfirmed } from '../../../utils/transaction'
import { useWalletState } from '../../../utils/wallet/walletStore'

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
    const offer = getOffer(walletStore.txOfferMap[tx.txid])
    const sats = tx.received - tx.sent
    const price = sats / satsPerUnit
    const type = getTransactionType(tx, offer)

    setTransaction({
      id: tx.txid,
      offerId: offer?.id,
      type,
      amount: sats,
      price,
      currency,
      date: txIsConfirmed(tx) ? new Date(tx.block_timestamp * 1000) : new Date(),
      confirmed: txIsConfirmed(tx),
    })
  }, [currency, route, satsPerUnit, walletStore, walletStore.txOfferMap])

  return {
    transaction,
    receivingAddress,
    openInExplorer,
  }
}
