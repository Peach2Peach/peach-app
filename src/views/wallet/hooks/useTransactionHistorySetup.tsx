import { useFocusEffect } from '@react-navigation/native'
import { ConfirmedTransaction, PendingTransaction } from 'bdk-rn/lib/lib/interfaces'
import { useCallback, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'

import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useBitcoinStore } from '../../../store/bitcoinStore'
import i18n from '../../../utils/i18n'
import { getOffer } from '../../../utils/offer'
import { useWalletState } from '../../../utils/wallet/walletStore'

export type TransactionType = 'TRADE' | 'WITHDRAWAL' | 'DEPOSIT'
export type TransactionSummary = {
  id: string
  offerId?: string
  type: TransactionType
  amount: number
  price: number
  currency: Currency
  date: Date
}
const transactionisConfirmed = (tx: ConfirmedTransaction | PendingTransaction): tx is ConfirmedTransaction =>
  'block_height' in tx

export const useTransactionHistorySetup = () => {
  const navigation = useNavigation()
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
        walletStore.getAllTransactions().map((tx) => {
          const offer = getOffer(walletStore.txOfferMap[tx.txid])
          const sats = tx.received - tx.sent
          const price = sats / satsPerUnit
          const type: TransactionType = offer?.id ? 'TRADE' : tx.received === 0 ? 'WITHDRAWAL' : 'DEPOSIT'

          return {
            id: tx.txid,
            offerId: offer?.id,
            type,
            amount: sats,
            price,
            currency,
            date: transactionisConfirmed(tx) ? new Date(tx.block_timestamp * 1000) : new Date(),
          }
        }),
      )
    }, [currency, satsPerUnit, walletStore]),
  )
  return {
    navigation,
    transactions,
  }
}
