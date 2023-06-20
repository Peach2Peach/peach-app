import { useWalletState } from './walletStore'

describe('walletStore', () => {
  afterEach(() => {
    useWalletState.getState().reset()
  })
  it('returns defaults', () => {
    expect(useWalletState.getState()).toEqual({
      ...useWalletState.getState(),
      addresses: [],
      balance: 0,
      pendingTransactions: {},
      transactions: [],
      txOfferMap: {},
    })
  })
  it('adds pending transactions', () => {
    useWalletState.getState().addPendingTransactionHex('txId', 'txHex')
    expect(useWalletState.getState().pendingTransactions).toEqual({ txId: 'txHex' })
  })
  it('removes pending transactions', () => {
    useWalletState.getState().addPendingTransactionHex('txId', 'txHex')
    useWalletState.getState().removePendingTransaction('txId')
    expect(useWalletState.getState().pendingTransactions).toEqual({})
  })
})
