import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { migrateWalletStore } from './migrateWalletStore'
import { ConfirmedTransaction, PendingTransaction, WalletStateVersion0 } from './version0'
import { WalletStateVersion1 } from './version1'
import { WalletStateVersion2 } from './version2'

// eslint-disable-next-line max-lines-per-function
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
      fundedFromPeachWallet: [],
      addressLabelMap: {},
      fundMultipleMap: {},
      showBalance: false,
      selectedUTXOIds: [],
      isSynced: false,
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
      pendingTransactions: undefined,
    })
  })
  it('should migrate from version 1 by nuking txOfferMap (will be rebuilt)', () => {
    const version1Store: WalletStateVersion1 = {
      addresses: [],
      balance: 0,
      transactions: [],
      pendingTransactions: {},
      fundedFromPeachWallet: [],
      txOfferMap: { txId1: '1' },
      addressLabelMap: {},
      fundMultipleMap: {},
      showBalance: true,
      selectedUTXOIds: [],
      isSynced: false,
    }

    const migratedStore = migrateWalletStore(version1Store, 1)
    expect(migratedStore).toEqual({
      ...version1Store,
      txOfferMap: {},
      pendingTransactions: undefined,
    })
  })
  it('should migrate from version 2 by removing pendingTransactions', () => {
    const version2Store: WalletStateVersion2 = {
      addresses: [],
      balance: 0,
      transactions: [],
      pendingTransactions: {},
      fundedFromPeachWallet: [],
      txOfferMap: { txId1: ['1'] },
      addressLabelMap: {},
      fundMultipleMap: {},
      showBalance: true,
      selectedUTXOIds: [],
      isSynced: false,
    }

    const migratedStore = migrateWalletStore(version2Store, 2)
    expect(migratedStore).toEqual({
      ...version2Store,
      pendingTransactions: undefined,
    })
  })
})
