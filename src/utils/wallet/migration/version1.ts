import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { info } from '../../log/info'
import { WalletStateVersion2 } from './version2'

export type ConfirmedTransaction = {
  txid: string
  block_timestamp: number
  sent: number
  block_height: number
  received: number
  fee: number
}
export type PendingTransaction = {
  txid: string
  sent: number
  received: number
  fee: number
}
export type TransactionsResponse = {
  confirmed: ConfirmedTransaction[]
  pending: PendingTransaction[]
}
export type WalletStateVersion1 = {
  balance: number
  addresses: string[]
  transactions: TransactionDetails[]
  pendingTransactions: Record<string, string>
  fundedFromPeachWallet: string[]
  txOfferMap: Record<string, string>
  addressLabelMap: Record<string, string>
  fundMultipleMap: Record<string, string[]>
  showBalance: boolean
  selectedUTXOIds: string[]
  isSynced: boolean
}

export const version1 = (persistedState: unknown): WalletStateVersion2 => {
  info('WalletStore - migrating from version 1')

  const version1State = persistedState as WalletStateVersion1

  return {
    ...version1State,
    txOfferMap: {},
  }
}
