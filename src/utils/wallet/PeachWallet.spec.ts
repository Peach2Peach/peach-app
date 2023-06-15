/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { waitFor } from '@testing-library/react-native'
import { PartiallySignedTransaction, Transaction, TxBuilder } from 'bdk-rn'
import { TransactionDetails, TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { AddressIndex } from 'bdk-rn/lib/lib/enums'
import { account1 } from '../../../tests/unit/data/accountData'
import { confirmed1, confirmed2, pending1, pending2, pending3 } from '../../../tests/unit/data/transactionDetailData'
import { getError } from '../../../tests/unit/helpers/getError'
import {
  blockChainCreateMock,
  blockchainBroadcastMock,
  walletGetAddressMock,
  mnemonicFromStringMock,
  psbtExtractTxMock,
  txBuilderFinishMock,
  walletGetBalanceMock,
  walletListTransactionsMock,
  walletSignMock,
  walletSyncMock,
} from '../../../tests/unit/mocks/bdkRN'
import { tradeSummaryStore } from '../../store/tradeSummaryStore'
import { PeachWallet } from './PeachWallet'
import { createWalletFromSeedPhrase } from './createWalletFromSeedPhrase'
import { getNetwork } from './getNetwork'
import { walletStore } from './walletStore'

jest.mock('./PeachWallet', () => jest.requireActual('./PeachWallet'))

const getTxHexMock = jest.fn(({ txId }) => [`${txId}Hex`])
jest.mock('../electrum/getTxHex', () => ({
  getTxHex: (args: any) => getTxHexMock(args),
}))

const rebroadcastTransactionsMock = jest.fn()
jest.mock('./rebroadcastTransactions', () => ({
  rebroadcastTransactions: (args: any) => rebroadcastTransactionsMock(args),
}))

const buildDrainWalletTransactionMock = jest.fn()
jest.mock('./transaction/buildDrainWalletTransaction', () => ({
  buildDrainWalletTransaction: (...args: any[]) => buildDrainWalletTransactionMock(...args),
}))

describe('PeachWallet', () => {
  const txResponse: TransactionDetails[] = [
    { txid: 'txid1', sent: 1, received: 1, fee: 1, confirmationTime: { timestamp: 1, height: 1 } },
    { txid: 'txid2', sent: 2, received: 2, fee: 2 },
  ]
  const listTransactionsMock = jest.fn().mockResolvedValue(txResponse)

  const { wallet } = createWalletFromSeedPhrase(account1.mnemonic, getNetwork())
  let peachWallet: PeachWallet

  beforeEach(async () => {
    peachWallet = new PeachWallet({ wallet })
    await peachWallet.loadWallet()
  })
  afterEach(() => {
    walletStore.getState().reset()
  })

  it('instantiates', () => {
    peachWallet = new PeachWallet({ wallet })

    expect(peachWallet.initialized).toBeFalsy()
    expect(peachWallet.synced).toBeFalsy()
    expect(peachWallet.descriptorPath).toEqual('/84\'/1\'/0\'/0/*')
  })
  it('instantiates for mainnet', () => {
    peachWallet = new PeachWallet({ wallet, network: 'bitcoin' })

    expect(peachWallet.initialized).toBeFalsy()
    expect(peachWallet.synced).toBeFalsy()
    expect(peachWallet.descriptorPath).toEqual('/84\'/0\'/0\'/0/*')
  })
  it('loads existing data', () => {
    const balance = 50000
    walletStore.getState().setBalance(balance)
    peachWallet.loadWallet()
    expect(peachWallet.balance).toBe(balance)
    expect(blockChainCreateMock).toHaveBeenCalledWith(
      { concurrency: '5', proxy: '', stopGap: '25', timeout: '5', url: 'https://localhost:3000' },
      'Esplora',
    )
  })
  it('loads wallet with seed', async () => {
    await peachWallet.loadWallet(account1.mnemonic)
    expect(mnemonicFromStringMock).toHaveBeenCalledWith(account1.mnemonic)
  })
  it('load existing when wallet store is ready', () => {
    const balance = 50000
    const hasHydratedSpy = jest.spyOn(walletStore.persist, 'hasHydrated')
    const onFinishHydrationSpy = jest.spyOn(walletStore.persist, 'onFinishHydration')
    hasHydratedSpy.mockReturnValueOnce(false)
    // @ts-ignore
    onFinishHydrationSpy.mockImplementationOnce((cb) => cb(walletStore.getState()))
    walletStore.getState().setBalance(balance)
    peachWallet.loadWallet()
    expect(peachWallet.balance).toBe(balance)
  })
  it('synchronises wallet with the blockchain', async () => {
    walletSyncMock.mockResolvedValueOnce(true)

    expect(peachWallet.synced).toBeFalsy()
    await peachWallet.syncWallet()
    expect(peachWallet.synced).toBeTruthy()
    expect(walletSyncMock).toHaveBeenCalled()
  })
  it('gets balance and transactions after sync', async () => {
    walletSyncMock.mockResolvedValueOnce(true)
    walletGetBalanceMock.mockResolvedValueOnce({
      total: 111110,
    })
    const transactions = [confirmed1, pending2]
    walletListTransactionsMock.mockResolvedValueOnce(transactions)
    await peachWallet.syncWallet()
    await waitFor(() => expect(peachWallet.balance).toBe(111110))
    await waitFor(() => expect(peachWallet.transactions).toEqual(transactions))
  })
  it('sync wallet attempt throws error if wallet is not ready', async () => {
    peachWallet.wallet = undefined
    const error = await getError<Error>(() => peachWallet.syncWallet())

    expect(error.message).toBe('WALLET_NOT_READY')
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
  it('removes pending transactions that are replaced', async () => {
    peachWallet.transactions = [{ txid: 'txid1', sent: 1, received: 1, fee: 1 }]
    const replacement = { txid: 'txid2', sent: 1, received: 1, fee: 1 }

    listTransactionsMock.mockResolvedValueOnce([replacement])
    rebroadcastTransactionsMock.mockImplementationOnce(() => walletStore.getState().removePendingTransaction('txid1'))
    // @ts-ignore
    peachWallet.wallet.listTransactions = listTransactionsMock

    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual([replacement])
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
  it('gets balance', async () => {
    walletGetBalanceMock.mockResolvedValueOnce({
      total: 111110,
    })
    await peachWallet.getBalance()
    await waitFor(() => expect(peachWallet.balance).toBe(111110))
  })
  it('throws error when requesting balance before wallet is ready', async () => {
    peachWallet.wallet = undefined
    const error = await getError<Error>(() => peachWallet.getBalance())
    expect(error.message).toBe('WALLET_NOT_READY')
  })
  it('gets transactions', async () => {
    const transactions = [confirmed1, pending2]
    walletListTransactionsMock.mockResolvedValueOnce(transactions)

    await peachWallet.getTransactions()
    await waitFor(() => expect(peachWallet.transactions).toEqual(transactions))
  })
  it('throws error when requesting transactions before wallet is ready', async () => {
    peachWallet.wallet = undefined
    const error = await getError<Error>(() => peachWallet.getTransactions())
    expect(error.message).toBe('WALLET_NOT_READY')
  })
  it('gets a new unused receiving address', async () => {
    const address = 'address'
    const index = 0
    walletGetAddressMock.mockResolvedValueOnce({ address, index })

    const { address: newAddress, index: addressIndex } = await peachWallet.getReceivingAddress()
    expect(newAddress).toBe(address)
    expect(addressIndex).toBe(index)
    expect(walletGetAddressMock).toHaveBeenCalledWith(AddressIndex.New)
  })
  it('throws error when requesting receiving address before wallet is ready', async () => {
    peachWallet.wallet = undefined
    const error = await getError<Error>(() => peachWallet.getReceivingAddress())
    expect(error.message).toBe('WALLET_NOT_READY')
  })
  it('updates wallet sotre', () => {
    peachWallet.synced = true
    peachWallet.transactions = [confirmed1, confirmed2, pending3]
    tradeSummaryStore.getState().setContract('1-3', { id: '1-3', releaseTxId: confirmed1.txid })
    tradeSummaryStore.getState().setOffer('2', { id: '2', txId: confirmed2.txid })
    peachWallet.updateStore()
    expect(walletStore.getState().transactions).toEqual([confirmed1, confirmed2, pending3])
    expect(walletStore.getState().txOfferMap).toEqual({
      txid1: '3',
      txid2: '2',
    })
  })
  it('withdraws full balance to an address', async () => {
    const address = 'address'
    const feeRate = 10

    const result: TxBuilderResult = {
      psbt: new PartiallySignedTransaction('base64'),
      txDetails: pending1,
    }
    const transaction = await new Transaction().create([])
    const txBuilder = await new TxBuilder().create()

    buildDrainWalletTransactionMock.mockResolvedValueOnce(txBuilder)
    txBuilderFinishMock.mockResolvedValueOnce(result)
    walletSignMock.mockResolvedValueOnce(result.psbt)
    psbtExtractTxMock.mockResolvedValueOnce(transaction)
    await peachWallet.withdrawAll(address, feeRate)
    expect(buildDrainWalletTransactionMock).toHaveBeenCalledWith(address, feeRate)
    expect(txBuilderFinishMock).toHaveBeenCalledWith(peachWallet.wallet)
    expect(walletSignMock).toHaveBeenCalledWith(result.psbt)
    expect(blockchainBroadcastMock).toHaveBeenCalledWith(transaction)
  })

  it('throws error when trying to withdraw before wallet is ready', async () => {
    peachWallet.wallet = undefined
    const error = await getError<Error>(() => peachWallet.withdrawAll('address', 1))
    expect(error.message).toBe('WALLET_NOT_READY')
  })
})
