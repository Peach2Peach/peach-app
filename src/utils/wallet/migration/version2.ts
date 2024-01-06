import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { info } from '../../log/info'
import { omit } from '../../object/omit'
import { WalletState } from '../walletStore'

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
export type WalletStateVersion2 = {
  balance: number
  addresses: string[]
  transactions: TransactionDetails[]
  pendingTransactions: Record<string, string>
  fundedFromPeachWallet: string[]
  txOfferMap: Record<string, string[]>
  addressLabelMap: Record<string, string>
  fundMultipleMap: Record<string, string[]>
  showBalance: boolean
  selectedUTXOIds: string[]
  isSynced: boolean
}

export const version2 = (persistedState: unknown): WalletState => {
  info('WalletStore - migrating from version 2')

  const version1State = persistedState as WalletStateVersion2

  return omit(version1State, 'pendingTransactions')
}
