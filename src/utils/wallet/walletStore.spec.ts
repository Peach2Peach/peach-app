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
      addressLabelMap: {},
      showBalance: true,
      selectedUTXOIds: [],
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
})
