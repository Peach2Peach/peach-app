/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { waitFor } from '@testing-library/react-native'
import { Address, PartiallySignedTransaction, Transaction, TxBuilder } from 'bdk-rn'
import { LocalUtxo, OutPoint, TransactionDetails, TxBuilderResult, TxOut } from 'bdk-rn/lib/classes/Bindings'
import { Script } from 'bdk-rn/lib/classes/Script'
import { AddressIndex, KeychainKind } from 'bdk-rn/lib/lib/enums'
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
  walletGetInternalAddressMock,
  walletListTransactionsMock,
  walletSignMock,
  walletSyncMock,
} from '../../../tests/unit/mocks/bdkRN'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { PeachWallet } from './PeachWallet'
import { createWalletFromBase58 } from './createWalletFromBase58'
import { getNetwork } from './getNetwork'
import { useWalletState } from './walletStore'

jest.mock('./PeachWallet', () => jest.requireActual('./PeachWallet'))

const postTransactionMock = jest.fn().mockResolvedValue(['txId'])
jest.mock('../electrum/postTransaction', () => ({
  postTransaction: (...args: unknown[]) => postTransactionMock(...args),
}))

const buildTransactionMock = jest.fn()
jest.mock('./transaction/buildTransaction', () => ({
  buildTransaction: (...args: unknown[]) => buildTransactionMock(...args),
}))

jest.useFakeTimers()

describe('PeachWallet', () => {
  const address1 = 'address1'
  const address2 = 'address2'
  const outpoint1 = new OutPoint(confirmed1.txid, 0)
  const outpoint2 = new OutPoint(confirmed2.txid, 0)
  const txOut1 = new TxOut(10000, new Script(address1))
  const txOut2 = new TxOut(10000, new Script(address2))
  const utxo1 = new LocalUtxo(outpoint1, txOut1, false, KeychainKind.External)
  const utxo2 = new LocalUtxo(outpoint2, txOut2, true, KeychainKind.External)

  const txResponse: TransactionDetails[] = [
    createTransaction({ txid: 'txid1', sent: 1, received: 1, fee: 1, confirmationTime: { timestamp: 1, height: 1 } }),
    createTransaction({ txid: 'txid2', sent: 2, received: 2, fee: 2 }),
  ]

  const wallet = createWalletFromBase58(account1.base58, getNetwork())
  let peachWallet: PeachWallet

  beforeEach(async () => {
    peachWallet = new PeachWallet({ wallet })
    await peachWallet.initWallet()
  })
  afterEach(() => {
    useWalletState.getState().reset()
  })

  it('instantiates', () => {
    peachWallet = new PeachWallet({ wallet })

    expect(peachWallet.initialized).toBeFalsy()
    expect(useWalletState.getState().isSynced).toBeFalsy()
    expect(peachWallet.descriptorPath).toEqual("/84'/1'/0'/0/*")
  })
  it('instantiates for mainnet', () => {
    peachWallet = new PeachWallet({ wallet, network: 'bitcoin' })

    expect(peachWallet.initialized).toBeFalsy()
    expect(useWalletState.getState().isSynced).toBeFalsy()
    expect(peachWallet.descriptorPath).toEqual("/84'/0'/0'/0/*")
  })
  it('synchronises wallet with the blockchain', async () => {
    walletSyncMock.mockResolvedValueOnce(true)

    expect(useWalletState.getState().isSynced).toBeFalsy()
    await peachWallet.syncWallet()
    expect(useWalletState.getState().isSynced).toBeTruthy()
    expect(walletSyncMock).toHaveBeenCalled()
  })
  it('catches wallet sync errors', async () => {
    walletSyncMock.mockImplementationOnce(() => {
      throw new Error('error')
    })

    expect(useWalletState.getState().isSynced).toBeFalsy()
    const error = await getError<Error>(() => peachWallet.syncWallet())
    expect(error.message).toBe('error')
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

    if (!peachWallet.wallet) {
      throw new Error('Wallet not ready')
    }
    jest.spyOn(peachWallet.wallet, 'listTransactions').mockResolvedValueOnce(txResponse)

    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual([txResponse[0], txResponse[1], existingTx[1]])
  })
  it('removes pending transactions that are now confirmed', async () => {
    const existingTx = [{ txid: 'txid1', sent: 1, received: 1, fee: 1 }]
    peachWallet.transactions = existingTx

    if (!peachWallet.wallet) {
      throw new Error('Wallet not ready')
    }
    jest.spyOn(peachWallet.wallet, 'listTransactions').mockResolvedValueOnce(txResponse)

    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual([txResponse[0], txResponse[1]])
  })
  it('removes pending transactions that are replaced', async () => {
    const existingTx = [createTransaction({ txid: 'txid1', sent: 1, received: 1, fee: 1 })]
    peachWallet.transactions = existingTx
    const replacement = createTransaction({ txid: 'txid2', sent: 1, received: 1, fee: 1 })

    postTransactionMock.mockResolvedValueOnce([null, 'bad-txns-inputs-missingorspent'])

    if (!peachWallet.wallet) {
      throw new Error('Wallet not ready')
    }
    jest.spyOn(peachWallet.wallet, 'listTransactions').mockResolvedValueOnce([replacement])

    const transactions = await peachWallet.getTransactions()
    expect(transactions).toEqual([replacement])
  })
  it('tries to rebroadcast tx that are dropped from the block explorer', async () => {
    const existingTx = [createTransaction({ txid: 'txid3', sent: 3, received: 3, fee: 3 })]
    peachWallet.transactions = existingTx

    if (!peachWallet.wallet) {
      throw new Error('Wallet not ready')
    }
    jest.spyOn(peachWallet.wallet, 'listTransactions').mockResolvedValueOnce(txResponse)

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
  it('gets the last unused receiving address', async () => {
    const address = 'address'
    const addressObject = new Address()
    addressObject.asString = jest.fn().mockResolvedValue(address)
    const index = 4
    walletGetAddressMock.mockResolvedValueOnce({ address: addressObject, index })

    const { address: newAddress, index: addressIndex } = await peachWallet.getLastUnusedAddress()
    expect(newAddress).toBe(address)
    expect(addressIndex).toBe(index)
    expect(walletGetAddressMock).toHaveBeenCalledWith(AddressIndex.LastUnused)
  })
  it('gets new internal address', async () => {
    const address = 'address'
    const addressObject = new Address()
    addressObject.asString = jest.fn().mockResolvedValue(address)
    const index = 4
    walletGetInternalAddressMock.mockResolvedValueOnce({ address: addressObject, index })

    const { address: newAddress, index: addressIndex } = await peachWallet.getNewInternalAddress()
    expect(newAddress).toBe(address)
    expect(addressIndex).toBe(index)
    expect(walletGetInternalAddressMock).toHaveBeenCalledWith(AddressIndex.New)
  })
  it('gets address by index', async () => {
    const address = 'address'
    const addressObject = new Address()
    addressObject.asString = jest.fn().mockResolvedValue(address)
    const index = 4
    walletGetAddressMock.mockResolvedValueOnce({ address: addressObject, index })

    const addressInfo = await peachWallet.getAddressByIndex(0)
    expect(addressInfo).toEqual({
      index: 0,
      address: 'bcrt1q7jyvzs6yu9wz8qzmcwyruw0e652xhyhkdw5qrt',
      used: true,
    })
  })
  it('gets a new unused receiving address', async () => {
    const address = 'address'
    const addressObject = new Address()
    addressObject.asString = jest.fn().mockResolvedValue(address)
    const index = 4
    walletGetAddressMock.mockResolvedValueOnce({ address: addressObject, index })

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
    useWalletState.getState().isSynced = true
    peachWallet.transactions = [confirmed1, confirmed2, pending3]
    useTradeSummaryStore.getState().setContract('1-3', { id: '1-3', releaseTxId: confirmed1.txid })
    useTradeSummaryStore.getState().setOffer('2', { id: '2', txId: confirmed2.txid })
    peachWallet.updateStore()
    expect(useWalletState.getState().transactions).toEqual([confirmed1, confirmed2, pending3])
    expect(useWalletState.getState().txOfferMap).toEqual({
      txid1: ['3'],
      txid2: ['2'],
    })
  })
  it('updates wallet store with offers funded from peach wallet', () => {
    const pendingOffer = { id: '4', fundingTxId: 'txid4' }
    const fundingTx = { txid: 'txid4', sent: 4, received: 4, fee: 4 }
    useWalletState.getState().isSynced = true
    peachWallet.transactions = [confirmed1, confirmed2, pending3, fundingTx]
    useTradeSummaryStore.getState().setContract('1-3', { id: '1-3', releaseTxId: confirmed1.txid })
    useTradeSummaryStore.getState().setOffer('2', { id: '2', txId: confirmed2.txid })
    useTradeSummaryStore.getState().setOffer('4', pendingOffer)
    peachWallet.updateStore()
    expect(useWalletState.getState().transactions).toEqual([confirmed1, confirmed2, pending3, fundingTx])
    expect(useWalletState.getState().txOfferMap).toEqual({
      txid1: ['3'],
      txid2: ['2'],
      txid4: ['4'],
    })
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
    const withdrawResult = await peachWallet.sendTo({ address, amount, feeRate })
    expect(buildTransactionMock).toHaveBeenCalledWith({ address, amount, feeRate })
    expect(txBuilderFinishMock).toHaveBeenCalledWith(peachWallet.wallet)
    expect(walletSignMock).toHaveBeenCalledWith(result.psbt)
    expect(blockchainBroadcastMock).toHaveBeenCalledWith(transaction)
    expect(withdrawResult).toEqual(result.psbt)
  })

  it('sends bitcoin to an address with selected utxo', async () => {
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
    const withdrawResult = await peachWallet.sendTo({ address, amount, feeRate, utxos: [utxo1, utxo2] })
    expect(buildTransactionMock).toHaveBeenCalledWith({ address, amount, feeRate, utxos: [utxo1, utxo2] })
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
  const wallet = createWalletFromBase58(account1.base58, getNetwork())
  let peachWallet: PeachWallet

  beforeEach(() => {
    peachWallet = new PeachWallet({ wallet })
    useWalletState.getState().reset()
  })
  it('loads existing data', async () => {
    const balance = 50000
    useWalletState.getState().setBalance(balance)
    await peachWallet.initWallet()
    expect(peachWallet.balance).toBe(balance)
    expect(blockChainCreateMock).toHaveBeenCalledWith(
      { concurrency: 1, proxy: null, stopGap: 25, timeout: 30, baseUrl: 'https://localhost:3000' },
      'Esplora',
    )
  })
  it('loads wallet with seed', async () => {
    await peachWallet.initWallet(account1.mnemonic)
    expect(mnemonicFromStringMock).toHaveBeenCalledWith(account1.mnemonic)
  })
  it('load existing when wallet store is ready', () => {
    const balance = 50000
    const hasHydratedSpy = jest.spyOn(useWalletState.persist, 'hasHydrated')
    const onFinishHydrationSpy = jest.spyOn(useWalletState.persist, 'onFinishHydration')
    hasHydratedSpy.mockReturnValueOnce(false)
    // @ts-expect-error it's just a mock
    onFinishHydrationSpy.mockImplementationOnce((cb) => cb(useWalletState.getState()))
    useWalletState.getState().setBalance(balance)
    peachWallet.loadWallet()
    expect(peachWallet.balance).toBe(balance)
  })
  it('sets initialized to true when wallet is loaded', async () => {
    await peachWallet.initWallet()
    expect(peachWallet.initialized).toBeTruthy()
  })
})

describe('PeachWallet - buildFinishedTransaction', () => {
  const wallet = createWalletFromBase58(account1.base58, getNetwork())
  let peachWallet: PeachWallet

  beforeEach(async () => {
    peachWallet = new PeachWallet({ wallet })
    await peachWallet.initWallet()
  })
  const utxo = new LocalUtxo(
    new OutPoint('txid', 0),
    new TxOut(10000, new Script('address')),
    false,
    KeychainKind.External,
  )
  const params = {
    address: 'address',
    amount: 10000,
    feeRate: 10,
    utxos: [utxo],
    shouldDrainWallet: true,
  }
  it('should call buildTransaction with the correct params and finish the tx', async () => {
    const txBuilder = await new TxBuilder().create()
    buildTransactionMock.mockResolvedValue(txBuilder)

    await peachWallet.buildFinishedTransaction(params)
    expect(buildTransactionMock).toHaveBeenCalledWith(params)
    expect(txBuilderFinishMock).toHaveBeenCalledWith(peachWallet.wallet)
  })
  it('should handle the wallet not being ready', async () => {
    peachWallet.wallet = undefined
    const error = await getError<Error>(() => peachWallet.buildFinishedTransaction(params))
    expect(error.message).toBe('WALLET_NOT_READY')
  })
})
