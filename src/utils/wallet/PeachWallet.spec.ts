/* eslint-disable max-lines-per-function */
import BdkRn from 'bdk-rn'
import { account1 } from '../../../tests/unit/data/accountData'
import { PeachWallet } from './PeachWallet'
import { createWalletFromSeedPhrase } from './createWalletFromSeedPhrase'
import { getNetwork } from './getNetwork'
import { walletStore } from './walletStore'
import { TransactionsResponse } from 'bdk-rn/lib/lib/interfaces'
import { error } from '../log'

jest.mock('./PeachWallet', () => jest.requireActual('./PeachWallet'))

const getTxHexMock = jest.fn(({ txId }) => [txId + 'Hex'])
jest.mock('./getTxHex', () => ({
  getTxHex: (args: any) => getTxHexMock(args),
}))

const rebroadcastTransactionsMock = jest.fn()
jest.mock('./peachWallet/rebroadcastTransactions', () => ({
  rebroadcastTransactions: (args: any) => rebroadcastTransactionsMock(args),
}))

describe('PeachWallet', () => {
  const getTransactionsSpy = jest.spyOn(BdkRn, 'getTransactions')
  const txResponse: TransactionsResponse = {
    confirmed: [{ txid: 'txid1', block_timestamp: 1, sent: 1, block_height: 1, received: 1, fee: 1 }],
    pending: [{ txid: 'txid2', sent: 2, received: 2, fee: 2 }],
  }
  // @ts-ignore
  getTransactionsSpy.mockResolvedValue({ value: txResponse, isErr: () => false })

  const { wallet } = createWalletFromSeedPhrase(account1.mnemonic!, getNetwork())

  afterEach(() => {
    jest.clearAllMocks()
    walletStore.getState().reset()
  })

  it('instantiates', () => {
    const peachWallet = new PeachWallet({ wallet })
    expect(peachWallet.initialized).toBeFalsy()
    expect(peachWallet.synced).toBeFalsy()
    expect(peachWallet.wallet).toEqual(wallet)
  })
  it('load existing data', () => {
    const peachWallet = new PeachWallet({ wallet })
    const balance = 50000
    const addresses = ['address1', 'address2']
    walletStore.getState().setBalance(balance)
    walletStore.getState().setAddresses(addresses)
    peachWallet.loadWallet()
    expect(peachWallet.balance).toBe(balance)
    expect(peachWallet.addresses).toBe(addresses)
  })
  it('load existing when wallet store is ready', () => {
    const peachWallet = new PeachWallet({ wallet })
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
    const peachWallet = new PeachWallet({ wallet })
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
    getTransactionsSpy.mockResolvedValueOnce({ value: txResponse, isErr: () => false })

    const peachWallet = new PeachWallet({ wallet })
    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual(txResponse)
  })
  it('overwrites confirmed and merges pending transactions', async () => {
    const peachWallet = new PeachWallet({ wallet })
    peachWallet.transactions = {
      confirmed: [{ txid: 'txid1', block_timestamp: 1, sent: 1, block_height: 1, received: 1, fee: 1 }],
      pending: [{ txid: 'txid3', sent: 3, received: 3, fee: 3 }],
    }
    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual({
      confirmed: [{ txid: 'txid1', block_timestamp: 1, sent: 1, block_height: 1, received: 1, fee: 1 }],
      pending: [
        { txid: 'txid3', sent: 3, received: 3, fee: 3 },
        { txid: 'txid2', sent: 2, received: 2, fee: 2 },
      ],
    })
  })
  it('removes pending transactions that are now confirmed', async () => {
    const peachWallet = new PeachWallet({ wallet })
    peachWallet.transactions = {
      confirmed: [],
      pending: [{ txid: 'txid1', sent: 1, received: 1, fee: 1 }],
    }
    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual({
      confirmed: [{ txid: 'txid1', block_timestamp: 1, sent: 1, block_height: 1, received: 1, fee: 1 }],
      pending: [{ txid: 'txid2', sent: 2, received: 2, fee: 2 }],
    })
  })
  it('rebroadcasts tx that are dropped from the block explorer', async () => {
    const peachWallet = new PeachWallet({ wallet })
    peachWallet.transactions = {
      confirmed: [],
      pending: [{ txid: 'txid3', sent: 3, received: 3, fee: 3 }],
    }
    await peachWallet.getTransactions()
    expect(getTxHexMock).toHaveBeenCalledWith({ txId: 'txid3' })
    expect(rebroadcastTransactionsMock).toHaveBeenCalledWith({ txid3: 'txid3Hex' })
  })
  it('logs error if transaction could not be retrieved', async () => {
    // @ts-ignore
    getTransactionsSpy.mockResolvedValueOnce({ isErr: () => true, error: 'error' })

    const peachWallet = new PeachWallet({ wallet })
    await peachWallet.getTransactions()
    expect(error).toHaveBeenCalledWith('error')
  })
})
