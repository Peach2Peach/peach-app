import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'

import { useHeaderSetup } from '../../../hooks'
import { useBitcoinStore } from '../../../store/bitcoinStore'
import i18n from '../../../utils/i18n'
import { getOffer } from '../../../utils/offer'
import { getTransactionType } from '../../../utils/transaction'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { txIsConfirmed } from '../../../utils/transaction/txIsConfirmed'
import { sort } from '../../../utils/array'

export const useTransactionHistorySetup = () => {
  const [currency, satsPerUnit] = useBitcoinStore((state) => [state.currency, state.satsPerUnit], shallow)
  const walletStore = useWalletState()

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('wallet.transactionHistory'),
      }),
      [],
    ),
  )

  const [transactions, setTransactions] = useState<TransactionSummary[]>([])

  useFocusEffect(
    useCallback(() => {
      setTransactions(
        walletStore
          .getAllTransactions()
          .map((tx) => {
            const offer = getOffer(walletStore.txOfferMap[tx.txid])
            const sats = tx.received - tx.sent
            const price = sats / satsPerUnit
            const type = getTransactionType(tx, offer)

            return {
              id: tx.txid,
              offerId: offer?.id,
              type,
              amount: sats,
              price,
              currency,
              date: txIsConfirmed(tx) ? new Date(tx.block_timestamp * 1000) : new Date(),
            }
          })
          .sort(sort('date'))
          .reverse(),
      )
    }, [currency, satsPerUnit, walletStore]),
  )
  return {
    transactions,
  }
}
