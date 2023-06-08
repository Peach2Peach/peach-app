import { walletStore } from './walletStore'

describe('walletStore', () => {
  afterEach(() => {
    walletStore.getState().reset()
  })
  it('returns defaults', () => {
    expect(walletStore.getState()).toEqual({
      ...walletStore.getState(),
      addresses: [],
      balance: 0,
      pendingTransactions: {},
      transactions: [],
      txOfferMap: {},
    })
  })
  it('adds pending transactions', () => {
    walletStore.getState().addPendingTransactionHex('txId', 'txHex')
    expect(walletStore.getState().pendingTransactions).toEqual({ txId: 'txHex' })
  })
  it('removes pending transactions', () => {
    walletStore.getState().addPendingTransactionHex('txId', 'txHex')
    walletStore.getState().removePendingTransaction('txId')
    expect(walletStore.getState().pendingTransactions).toEqual({})
  })
})
