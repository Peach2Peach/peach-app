import { pending1, pending2 } from '../../../tests/unit/data/transactionDetailData'
import { useWalletState } from './walletStore'

// eslint-disable-next-line max-lines-per-function
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
      addressLabelMap: {},
      showBalance: true,
      selectedUTXOIds: [],
      isSynced: false,
    })
  })
  it('sets transactions', () => {
    useWalletState.getState().setTransactions([pending1])
    expect(useWalletState.getState().transactions).toEqual([pending1])
  })
  it('adds a transaction', () => {
    useWalletState.getState().setTransactions([pending1])
    useWalletState.getState().addTransaction(pending2)
    expect(useWalletState.getState().transactions).toEqual([pending1, pending2])
  })
  it('removes transactions', () => {
    useWalletState.getState().setTransactions([pending1])
    useWalletState.getState().removeTransaction(pending1.txid)
    expect(useWalletState.getState().transactions).toEqual([])
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
  it('adds a label to an address', () => {
    useWalletState.getState().labelAddress('address1', 'label')
    expect(useWalletState.getState().addressLabelMap).toEqual({ address1: 'label' })
  })
  it('updates a label of an address', () => {
    useWalletState.getState().labelAddress('address1', 'label')
    expect(useWalletState.getState().addressLabelMap).toEqual({ address1: 'label' })
    useWalletState.getState().labelAddress('address1', 'label update')
    expect(useWalletState.getState().addressLabelMap).toEqual({ address1: 'label update' })
  })
  it('registers offer ids for funding multiple escrows', () => {
    useWalletState.getState().registerFundMultiple('address1', ['1', '2', '3'])
    expect(useWalletState.getState().fundMultipleMap).toEqual({ address1: ['1', '2', '3'] })
  })
  it('unregisters address for funding multiple escrows', () => {
    useWalletState.getState().registerFundMultiple('address1', ['1', '2', '3'])
    useWalletState.getState().unregisterFundMultiple('address1')
    expect(useWalletState.getState().fundMultipleMap).toEqual({})
  })
  it('searches fund multiple info by offer id', () => {
    useWalletState.getState().registerFundMultiple('address1', ['1', '2', '3'])
    expect(useWalletState.getState().getFundMultipleByOfferId('1')).toEqual({
      address: 'address1',
      offerIds: ['1', '2', '3'],
    })
    expect(useWalletState.getState().getFundMultipleByOfferId('4')).toEqual(undefined)
  })
  it('toggles show balance', () => {
    expect(useWalletState.getState().showBalance).toEqual(true)
    useWalletState.getState().toggleShowBalance()
    expect(useWalletState.getState().showBalance).toEqual(false)
    useWalletState.getState().toggleShowBalance()
    expect(useWalletState.getState().showBalance).toEqual(true)
  })
  it('sets selected utxos', () => {
    useWalletState.getState().setSelectedUTXOIds(['utxo1', 'utxo2'])
    expect(useWalletState.getState().selectedUTXOIds).toEqual(['utxo1', 'utxo2'])
  })
  it('checks if offer has been funded with peach wallet', () => {
    const address = 'address'
    expect(useWalletState.getState().isFundedFromPeachWallet(address)).toBeFalsy()
    useWalletState.getState().setFundedFromPeachWallet(address)
    expect(useWalletState.getState().isFundedFromPeachWallet(address)).toBeTruthy()
  })
  it('sets isSynced', () => {
    expect(useWalletState.getState().isSynced).toBeFalsy()
    useWalletState.getState().setIsSynced(true)
    expect(useWalletState.getState().isSynced).toBeTruthy()
  })
  it("doesn't persist isSynced", () => {
    expect(useWalletState.persist.getOptions().partialize?.(useWalletState.getState())).not.toEqual(
      expect.objectContaining({ isSynced: expect.any(Boolean) }),
    )
  })
})
