/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { waitFor } from '@testing-library/react-native'
import { PartiallySignedTransaction, Transaction, TxBuilder } from 'bdk-rn'
import { TransactionDetails, TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { AddressIndex } from 'bdk-rn/lib/lib/enums'
import { account1 } from '../../../tests/unit/data/accountData'
import { insufficientFunds } from '../../../tests/unit/data/errors'
import {
  confirmed1,
  confirmed2,
  createTransaction,
  pending1,
  pending2,
  pending3,
} from '../../../tests/unit/data/transactionDetailData'
import { getError } from '../../../tests/unit/helpers/getError'
import {
  blockChainCreateMock,
  blockchainBroadcastMock,
  mnemonicFromStringMock,
  psbtExtractTxMock,
  txBuilderFinishMock,
  walletGetAddressMock,
  walletGetBalanceMock,
  walletListTransactionsMock,
  walletSignMock,
  walletSyncMock,
} from '../../../tests/unit/mocks/bdkRN'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { error as logError } from '../log'
import { PeachWallet } from './PeachWallet'
import { createWalletFromSeedPhrase } from './createWalletFromSeedPhrase'
import { getNetwork } from './getNetwork'
import { useWalletState } from './walletStore'

jest.mock('./PeachWallet', () => jest.requireActual('./PeachWallet'))

const postTransactionMock = jest.fn().mockResolvedValue(['txId'])
jest.mock('../electrum/postTransaction', () => ({
  postTransaction: (...args: any[]) => postTransactionMock(...args),
}))

const buildDrainWalletTransactionMock = jest.fn()
jest.mock('./transaction/buildDrainWalletTransaction', () => ({
  buildDrainWalletTransaction: (...args: any[]) => buildDrainWalletTransactionMock(...args),
}))

const buildTransactionMock = jest.fn()
jest.mock('./transaction/buildTransaction', () => ({
  buildTransaction: (...args: any[]) => buildTransactionMock(...args),
}))

jest.useFakeTimers()

describe('PeachWallet', () => {
  const txResponse: TransactionDetails[] = [
    createTransaction({ txid: 'txid1', sent: 1, received: 1, fee: 1, confirmationTime: { timestamp: 1, height: 1 } }),
    createTransaction({ txid: 'txid2', sent: 2, received: 2, fee: 2 }),
  ]
  const listTransactionsMock = jest.fn().mockResolvedValue(txResponse)

  const { wallet } = createWalletFromSeedPhrase(account1.mnemonic, getNetwork())
  let peachWallet: PeachWallet

  beforeEach(async () => {
    peachWallet = new PeachWallet({ wallet })
    await peachWallet.loadWallet()
  })
  afterEach(() => {
    useWalletState.getState().reset()
  })

  it('instantiates', () => {
    peachWallet = new PeachWallet({ wallet })

    expect(peachWallet.initialized).toBeFalsy()
    expect(peachWallet.synced).toBeFalsy()
    expect(peachWallet.descriptorPath).toEqual("/84'/1'/0'/0/*")
  })
  it('instantiates for mainnet', () => {
    peachWallet = new PeachWallet({ wallet, network: 'bitcoin' })

    expect(peachWallet.initialized).toBeFalsy()
    expect(peachWallet.synced).toBeFalsy()
    expect(peachWallet.descriptorPath).toEqual("/84'/0'/0'/0/*")
  })
  it('synchronises wallet with the blockchain', async () => {
    walletSyncMock.mockResolvedValueOnce(true)

    expect(peachWallet.synced).toBeFalsy()
    await peachWallet.syncWallet()
    expect(peachWallet.synced).toBeTruthy()
    expect(walletSyncMock).toHaveBeenCalled()
  })
  it('logs sync errors', async () => {
    const errorMsg = 'sync error'
    walletSyncMock.mockImplementationOnce(() => {
      throw new Error(errorMsg)
    })

    await peachWallet.syncWallet()
    expect(peachWallet.synced).toBeFalsy()
    expect(logError).toHaveBeenCalledWith(errorMsg)
  })
  it('waits for already running sync', async () => {
    jest.clearAllMocks()
    const promise = new Promise((resolve) => setTimeout(resolve, 100))
    walletSyncMock.mockReturnValueOnce(promise)

    expect(peachWallet.syncInProgress).toBeUndefined()
    peachWallet.syncWallet()
    expect(peachWallet.syncInProgress).not.toBeUndefined()
    peachWallet.syncWallet()
    jest.runAllTimers()
    await peachWallet.syncInProgress
    expect(peachWallet.syncInProgress).toBeUndefined()
    expect(walletSyncMock).toHaveBeenCalledTimes(1)
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
    const existingTx = [
      createTransaction({ txid: 'txid1', sent: 1, received: 1, fee: 1, confirmationTime: { timestamp: 1, height: 1 } }),
      createTransaction({ txid: 'txid3', sent: 3, received: 3, fee: 3 }),
    ]
    peachWallet.transactions = existingTx

    // @ts-ignore
    peachWallet.wallet.listTransactions = listTransactionsMock

    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual([txResponse[0], txResponse[1], existingTx[1]])
  })
  it('removes pending transactions that are now confirmed', async () => {
    const existingTx = [{ txid: 'txid1', sent: 1, received: 1, fee: 1 }]
    peachWallet.transactions = existingTx

    // @ts-ignore
    peachWallet.wallet.listTransactions = listTransactionsMock

    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual([txResponse[0], txResponse[1]])
  })
  it('removes pending transactions that are replaced', async () => {
    const existingTx = [createTransaction({ txid: 'txid1', sent: 1, received: 1, fee: 1 })]
    peachWallet.transactions = existingTx
    const replacement = createTransaction({ txid: 'txid2', sent: 1, received: 1, fee: 1 })

    listTransactionsMock.mockResolvedValueOnce([replacement])
    postTransactionMock.mockResolvedValueOnce([null, 'bad-txns-inputs-missingorspent'])

    // @ts-ignore
    peachWallet.wallet.listTransactions = listTransactionsMock

    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual([replacement])
  })
  it('tries to rebroadcast tx that are dropped from the block explorer', async () => {
    const existingTx = [createTransaction({ txid: 'txid3', sent: 3, received: 3, fee: 3 })]
    peachWallet.transactions = existingTx

    // @ts-ignore
    peachWallet.wallet.listTransactions = listTransactionsMock

    await peachWallet.getTransactions()
    expect(postTransactionMock).toHaveBeenCalledWith({ tx: '7478696433' })
  })
  it('gets pending transactions', () => {
    peachWallet.transactions = [confirmed1, pending1, pending2, confirmed2]
    expect(peachWallet.getPendingTransactions()).toEqual([pending1, pending2])
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
  it('updates wallet store', () => {
    peachWallet.synced = true
    peachWallet.transactions = [confirmed1, confirmed2, pending3]
    useTradeSummaryStore.getState().setContract('1-3', { id: '1-3', releaseTxId: confirmed1.txid })
    useTradeSummaryStore.getState().setOffer('2', { id: '2', txId: confirmed2.txid })
    peachWallet.updateStore()
    expect(useWalletState.getState().transactions).toEqual([confirmed1, confirmed2, pending3])
    expect(useWalletState.getState().txOfferMap).toEqual({
      txid1: '3',
      txid2: '2',
    })
  })
  it('updates wallet store with offers funded from peach wallet', () => {
    const pendingOffer = { id: '4', fundingTxId: 'txid4' }
    const fundingTx = { txid: 'txid4', sent: 4, received: 4, fee: 4 }
    peachWallet.synced = true
    peachWallet.transactions = [confirmed1, confirmed2, pending3, fundingTx]
    useTradeSummaryStore.getState().setContract('1-3', { id: '1-3', releaseTxId: confirmed1.txid })
    useTradeSummaryStore.getState().setOffer('2', { id: '2', txId: confirmed2.txid })
    useTradeSummaryStore.getState().setOffer('4', pendingOffer)
    peachWallet.updateStore()
    expect(useWalletState.getState().transactions).toEqual([confirmed1, confirmed2, pending3, fundingTx])
    expect(useWalletState.getState().txOfferMap).toEqual({
      txid1: '3',
      txid2: '2',
      txid4: '4',
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
    const withdrawResult = await peachWallet.withdrawAll(address, feeRate)
    expect(buildDrainWalletTransactionMock).toHaveBeenCalledWith(address, feeRate)
    expect(txBuilderFinishMock).toHaveBeenCalledWith(peachWallet.wallet)
    expect(walletSignMock).toHaveBeenCalledWith(result.psbt)
    expect(blockchainBroadcastMock).toHaveBeenCalledWith(transaction)
    expect(withdrawResult).toEqual(result.psbt)
  })

  it('sends bitcoin to an address', async () => {
    const address = 'address'
    const amount = 10000
    const feeRate = 10

    const result: TxBuilderResult = {
      psbt: new PartiallySignedTransaction('base64'),
      txDetails: pending1,
    }
    const transaction = await new Transaction().create([])
    const txBuilder = await new TxBuilder().create()

    buildTransactionMock.mockResolvedValueOnce(txBuilder)
    txBuilderFinishMock.mockResolvedValueOnce(result)
    walletSignMock.mockResolvedValueOnce(result.psbt)
    psbtExtractTxMock.mockResolvedValueOnce(transaction)
    const withdrawResult = await peachWallet.sendTo(address, amount, feeRate)
    expect(buildTransactionMock).toHaveBeenCalledWith(address, amount, feeRate)
    expect(txBuilderFinishMock).toHaveBeenCalledWith(peachWallet.wallet)
    expect(walletSignMock).toHaveBeenCalledWith(result.psbt)
    expect(blockchainBroadcastMock).toHaveBeenCalledWith(transaction)
    expect(withdrawResult).toEqual(result.psbt)
  })

  it('signs and broadcast a transaction', async () => {
    const result: TxBuilderResult = {
      psbt: new PartiallySignedTransaction('base64'),
      txDetails: pending1,
    }
    const transaction = await new Transaction().create([])

    walletSignMock.mockResolvedValueOnce(result.psbt)
    psbtExtractTxMock.mockResolvedValueOnce(transaction)
    const signAndSendResult = await peachWallet.signAndBroadcastPSBT(result.psbt)
    expect(walletSignMock).toHaveBeenCalledWith(result.psbt)
    expect(blockchainBroadcastMock).toHaveBeenCalledWith(transaction)
    expect(signAndSendResult).toEqual(result.psbt)
  })
  it('finishes a transaction', async () => {
    const result: TxBuilderResult = {
      psbt: new PartiallySignedTransaction('base64'),
      txDetails: pending1,
    }
    txBuilderFinishMock.mockResolvedValueOnce(result)
    const txBuilder = await new TxBuilder().create()

    const signAndSendResult = await peachWallet.finishTransaction(txBuilder)
    expect(txBuilderFinishMock).toHaveBeenCalledWith(peachWallet.wallet)
    expect(signAndSendResult).toEqual(result)
  })
  it('throws error when trying to withdraw before wallet is ready', async () => {
    peachWallet.wallet = undefined
    const error = await getError<Error>(() => peachWallet.withdrawAll('address', 1))
    expect(error.message).toBe('WALLET_NOT_READY')
  })
  it('throws error when trying to broadcast before wallet is ready', async () => {
    peachWallet.wallet = undefined
    const error = await getError<Error>(() => peachWallet.signAndBroadcastPSBT(new PartiallySignedTransaction('base64')))
    expect(error.message).toBe('WALLET_NOT_READY')
  })
  it('handles broadcast errors', async () => {
    const result: TxBuilderResult = {
      psbt: new PartiallySignedTransaction('base64'),
      txDetails: pending1,
    }
    const transaction = await new Transaction().create([])

    walletSignMock.mockResolvedValueOnce(result.psbt)
    psbtExtractTxMock.mockResolvedValueOnce(transaction)
    blockchainBroadcastMock.mockImplementation(() => {
      throw insufficientFunds
    })
    const error = await getError<Error>(() => peachWallet.signAndBroadcastPSBT(result.psbt))
    expect(error).toEqual([new Error('INSUFFICIENT_FUNDS'), { available: '1089000', needed: '78999997952' }])
  })
  it('throws error when trying to finish transaction before wallet is ready', async () => {
    peachWallet.wallet = undefined
    const error = await getError<Error>(() => peachWallet.finishTransaction(new TxBuilder()))
    expect(error.message).toBe('WALLET_NOT_READY')
  })
  it('handles finish transaction errors', async () => {
    txBuilderFinishMock.mockImplementationOnce(() => {
      throw insufficientFunds
    })
    const error = await getError<Error>(() => peachWallet.finishTransaction(new TxBuilder()))
    expect(error).toEqual([new Error('INSUFFICIENT_FUNDS'), { available: '1089000', needed: '78999997952' }])
  })
})

describe('PeachWallet - loadWallet', () => {
  const { wallet } = createWalletFromSeedPhrase(account1.mnemonic, getNetwork())
  let peachWallet: PeachWallet

  beforeEach(() => {
    peachWallet = new PeachWallet({ wallet })
    useWalletState.getState().reset()
  })
  it('loads existing data', async () => {
    const balance = 50000
    useWalletState.getState().setBalance(balance)
    await peachWallet.loadWallet()
    expect(peachWallet.balance).toBe(balance)
    expect(blockChainCreateMock).toHaveBeenCalledWith(
      { concurrency: 1, proxy: null, stopGap: 25, timeout: 30, baseUrl: 'https://localhost:3000' },
      'Esplora',
    )
  })
  it('loads wallet with seed', async () => {
    await peachWallet.loadWallet(account1.mnemonic)
    expect(mnemonicFromStringMock).toHaveBeenCalledWith(account1.mnemonic)
  })
  it('load existing when wallet store is ready', () => {
    const balance = 50000
    const hasHydratedSpy = jest.spyOn(useWalletState.persist, 'hasHydrated')
    const onFinishHydrationSpy = jest.spyOn(useWalletState.persist, 'onFinishHydration')
    hasHydratedSpy.mockReturnValueOnce(false)
    // @ts-ignore
    onFinishHydrationSpy.mockImplementationOnce((cb) => cb(useWalletState.getState()))
    useWalletState.getState().setBalance(balance)
    peachWallet.loadWallet()
    expect(peachWallet.balance).toBe(balance)
  })
  it('sets initialized to true when wallet is loaded', async () => {
    await peachWallet.loadWallet()
    expect(peachWallet.initialized).toBeTruthy()
  })
})
