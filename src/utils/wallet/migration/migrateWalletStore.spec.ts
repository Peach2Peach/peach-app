import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { migrateWalletStore } from './migrateWalletStore'
import { ConfirmedTransaction, PendingTransaction, WalletStateVersion0 } from './version0'

describe('migrateWalletStore', () => {
  it('should migrate from version 0', () => {
    const confirmed: ConfirmedTransaction = {
      txid: 'txidconfirmed',
      block_timestamp: 1,
      sent: 12345,
      block_height: 1,
      received: 12345,
      fee: 123,
    }
    const pending: PendingTransaction = {
      txid: 'txidpending',
      sent: 12345,
      received: 12345,
      fee: 123,
    }
    const version0Store: WalletStateVersion0 = {
      balance: 0,
      addresses: [],
      transactions: {
        confirmed: [confirmed],
        pending: [pending],
      },
      pendingTransactions: {},
      txOfferMap: {},
    }

    const newConfirmed: TransactionDetails = {
      txid: 'txidconfirmed',
      confirmationTime: {
        height: 1,
        timestamp: 1,
      },
      sent: 12345,
      received: 12345,
      fee: 123,
    }
    const migratedStore = migrateWalletStore(version0Store, 0)
    expect(migratedStore).toEqual({
      ...version0Store,
      transactions: [newConfirmed, pending],
    })
  })
})
