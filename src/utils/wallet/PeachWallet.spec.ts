/* eslint-disable max-lines-per-function */
import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { account1 } from '../../../tests/unit/data/accountData'
import { PeachWallet } from './PeachWallet'
import { createWalletFromSeedPhrase } from './createWalletFromSeedPhrase'
import { getNetwork } from './getNetwork'
import { walletStore } from './walletStore'

jest.mock('bdk-rn')
jest.mock('./PeachWallet', () => jest.requireActual('./PeachWallet'))

const getTxHexMock = jest.fn(({ txId }) => [txId + 'Hex'])
jest.mock('../electrum/getTxHex', () => ({
  getTxHex: (args: any) => getTxHexMock(args),
}))

const rebroadcastTransactionsMock = jest.fn()
jest.mock('./rebroadcastTransactions', () => ({
  rebroadcastTransactions: (args: any) => rebroadcastTransactionsMock(args),
}))

describe('PeachWallet', () => {
  const txResponse: TransactionDetails[] = [
    { txid: 'txid1', sent: 1, received: 1, fee: 1, confirmationTime: { timestamp: 1, height: 1 } },
    { txid: 'txid2', sent: 2, received: 2, fee: 2 },
  ]
  const listTransactionsMock = jest.fn().mockResolvedValue(txResponse)

  const { wallet } = createWalletFromSeedPhrase(account1.mnemonic!, getNetwork())
  let peachWallet: PeachWallet

  beforeEach(async () => {
    peachWallet = new PeachWallet({ wallet })
    await peachWallet.loadWallet()
  })
  afterEach(() => {
    jest.clearAllMocks()
    walletStore.getState().reset()
  })

  it('instantiates', () => {
    peachWallet = new PeachWallet({ wallet })

    expect(peachWallet.initialized).toBeFalsy()
    expect(peachWallet.synced).toBeFalsy()
    expect(peachWallet.jsWallet).toEqual(wallet)
  })
  it('load existing data', () => {
    const balance = 50000
    const addresses = ['address1', 'address2']
    walletStore.getState().setBalance(balance)
    walletStore.getState().setAddresses(addresses)
    peachWallet.loadWallet()
    expect(peachWallet.balance).toBe(balance)
    expect(peachWallet.addresses).toBe(addresses)
  })
  it('load existing when wallet store is ready', () => {
    const balance = 50000
    const addresses = ['address1', 'address2']
    const hasHydratedSpy = jest.spyOn(walletStore.persist, 'hasHydrated')
    const onFinishHydrationSpy = jest.spyOn(walletStore.persist, 'onFinishHydration')
    hasHydratedSpy.mockReturnValueOnce(false)
    // @ts-ignore
    onFinishHydrationSpy.mockImplementationOnce((cb) => cb(walletStore.getState()))
    walletStore.getState().setBalance(balance)
    walletStore.getState().setAddresses(addresses)
    peachWallet.loadWallet()
    expect(peachWallet.balance).toBe(balance)
    expect(peachWallet.addresses).toBe(addresses)
  })
  it('finds key pair by address and stores scanned addresses', () => {
    const address = peachWallet.getAddress(3)

    if (!address) throw Error()
    const keyPair = peachWallet.findKeyPairByAddress(address)
    expect(keyPair?.publicKey.toString('hex')).toBe('03f5c7061bd2ca963c20edc0f8e09c42a9a5b35df3f708d3339446f1d00656b67c')
    expect(peachWallet.addresses).toEqual([
      'bcrt1q7jyvzs6yu9wz8qzmcwyruw0e652xhyhkdw5qrt',
      'bcrt1qgt4a6p3z8nr2a9snvlmd7vl0vqytq2l757gmn2',
      'bcrt1qfvss2z90h0cpwyp8tvtxytqjmrhdq0ltfacxgx',
      'bcrt1qupwsjlw68j596em27078uglyf8net95ddyr9ev',
    ])
  })
  it('gets transactions', async () => {
    // @ts-ignore
    peachWallet.wallet.listTransactions = listTransactionsMock

    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual(txResponse)
  })
  it('overwrites confirmed and merges pending transactions', async () => {
    peachWallet.transactions = [
      { txid: 'txid1', sent: 1, received: 1, fee: 1, confirmationTime: { timestamp: 1, height: 1 } },
      { txid: 'txid3', sent: 3, received: 3, fee: 3 },
    ]

    // @ts-ignore
    peachWallet.wallet.listTransactions = listTransactionsMock

    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual([
      { txid: 'txid1', sent: 1, received: 1, fee: 1, confirmationTime: { timestamp: 1, height: 1 } },
      { txid: 'txid2', sent: 2, received: 2, fee: 2 },
      { txid: 'txid3', sent: 3, received: 3, fee: 3 },
    ])
  })
  it('removes pending transactions that are now confirmed', async () => {
    peachWallet.transactions = [{ txid: 'txid1', sent: 1, received: 1, fee: 1 }]

    // @ts-ignore
    peachWallet.wallet.listTransactions = listTransactionsMock

    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual([
      { txid: 'txid1', sent: 1, received: 1, fee: 1, confirmationTime: { timestamp: 1, height: 1 } },
      { txid: 'txid2', sent: 2, received: 2, fee: 2 },
    ])
  })
  it('tries to rebroadcast tx that are dropped from the block explorer', async () => {
    peachWallet.transactions = [{ txid: 'txid3', sent: 3, received: 3, fee: 3 }]

    // @ts-ignore
    peachWallet.wallet.listTransactions = listTransactionsMock

    await peachWallet.getTransactions()
    expect(getTxHexMock).toHaveBeenCalledWith({ txId: 'txid2' })
    expect(getTxHexMock).toHaveBeenCalledWith({ txId: 'txid3' })
    expect(rebroadcastTransactionsMock).toHaveBeenCalledWith(['txid3'])
  })
  it('does not call getTxHex for already known tx', async () => {
    peachWallet.transactions = [{ txid: 'txid3', sent: 3, received: 3, fee: 3 }]
    walletStore.getState().addPendingTransactionHex('txid2', 'txid2Hex')
    walletStore.getState().addPendingTransactionHex('txid3', 'txid3Hex')

    // @ts-ignore
    peachWallet.wallet.listTransactions = listTransactionsMock

    await peachWallet.getTransactions()
    expect(getTxHexMock).not.toHaveBeenCalled()
  })
})
