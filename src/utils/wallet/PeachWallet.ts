import { BLOCKEXPLORER, NETWORK } from '@env'
import {
  Blockchain,
  BumpFeeTxBuilder,
  DatabaseConfig,
  Descriptor,
  PartiallySignedTransaction,
  TxBuilder,
  Wallet,
} from 'bdk-rn'
import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { AddressIndex, BlockChainNames, BlockchainEsploraConfig, KeychainKind } from 'bdk-rn/lib/lib/enums'
import { BIP32Interface } from 'bip32'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { getBuyOfferIdFromContract } from '../contract'
import { error, info } from '../log'
import { parseError } from '../result'
import { findTransactionsToRebroadcast, isPending, mergeTransactionList } from '../transaction'
import { callWhenInternet } from '../web'
import { PeachJSWallet } from './PeachJSWallet'
import { handleTransactionError } from './error/handleTransactionError'
import { getAndStorePendingTransactionHex } from './getAndStorePendingTransactionHex'
import { getDescriptorSecretKey } from './getDescriptorSecretKey'
import { rebroadcastTransactions } from './rebroadcastTransactions'
import { buildDrainWalletTransaction } from './transaction/buildDrainWalletTransaction'
import { useWalletState } from './walletStore'

type PeachWalletProps = {
  wallet: BIP32Interface
  network?: BitcoinNetwork
  gapLimit?: number
}

export class PeachWallet extends PeachJSWallet {
  initialized: boolean

  synced: boolean

  syncInProgress: Promise<void> | undefined

  descriptorPath: string

  balance: number

  transactions: TransactionDetails[]

  wallet: Wallet | undefined

  blockchain: Blockchain | undefined

  constructor ({ wallet, network = NETWORK, gapLimit = 25 }: PeachWalletProps) {
    super({ wallet, network, gapLimit })
    this.descriptorPath = `/84'/${network === 'bitcoin' ? '0' : '1'}'/0'/0/*`
    this.balance = 0
    this.transactions = []
    this.initialized = false
    this.synced = false
    this.syncInProgress = undefined
  }

  loadWallet (seedphrase?: string): Promise<void> {
    this.loadFromStorage()

    return new Promise((resolve) =>
      callWhenInternet(async () => {
        info('PeachWallet - loadWallet - start')

        const descriptorSecretKey = await getDescriptorSecretKey(this.network, seedphrase)
        const externalDescriptor = await new Descriptor().newBip84(
          descriptorSecretKey,
          KeychainKind.External,
          this.network,
        )
        const internalDescriptor = await new Descriptor().newBip84(
          descriptorSecretKey,
          KeychainKind.Internal,
          this.network,
        )

        const config: BlockchainEsploraConfig = {
          url: BLOCKEXPLORER,
          proxy: '',
          concurrency: '2',
          timeout: '10',
          stopGap: this.gapLimit.toString(),
        }

        this.blockchain = await new Blockchain().create(config, BlockChainNames.Esplora)
        const dbConfig = await new DatabaseConfig().memory()

        info('PeachWallet - loadWallet - createWallet')

        this.wallet = await new Wallet().create(externalDescriptor, internalDescriptor, this.network, dbConfig)

        info('PeachWallet - loadWallet - createdWallet')

        this.initialized = true

        this.syncWallet()

        info('PeachWallet - loadWallet - loaded')
        resolve()
      }),
    )
  }

  syncWallet (): Promise<void> {
    if (this.syncInProgress) return this.syncInProgress

    this.syncInProgress = new Promise((resolve, reject) =>
      callWhenInternet(async () => {
        if (!this.wallet || !this.blockchain) return reject(new Error('WALLET_NOT_READY'))

        info('PeachWallet - syncWallet - start')
        this.synced = false

        try {
          const success = await this.wallet.sync(this.blockchain)
          if (success) {
            this.getBalance()
            this.getTransactions()
            this.synced = true
            info('PeachWallet - syncWallet - synced')
          }
        } catch (e) {
          error(parseError(e))
        }

        this.syncInProgress = undefined
        return resolve()
      }),
    )
    return this.syncInProgress
  }

  updateStore (): void {
    useWalletState.getState().setTransactions(this.transactions)
    this.transactions
      .filter(({ txid }) => !useWalletState.getState().txOfferMap[txid])
      .forEach(({ txid }) => {
        const sellOffer = useTradeSummaryStore.getState().offers.find((offer) => offer.txId === txid)
        if (sellOffer?.id) return useWalletState.getState().updateTxOfferMap(txid, sellOffer.id)

        const contract = useTradeSummaryStore.getState().contracts.find((cntrct) => cntrct.releaseTxId === txid)
        if (contract) return useWalletState.getState().updateTxOfferMap(txid, getBuyOfferIdFromContract(contract))
        return null
      })
  }

  async getBalance (): Promise<number> {
    if (!this.wallet) throw Error('WALLET_NOT_READY')

    const balance = await this.wallet.getBalance()

    this.balance = Number(balance.total)
    useWalletState.getState().setBalance(this.balance)
    return this.balance
  }

  async getTransactions (): Promise<TransactionDetails[]> {
    if (!this.wallet) throw Error('WALLET_NOT_READY')

    const transactions = await this.wallet.listTransactions()
    this.transactions = mergeTransactionList(this.transactions, transactions)
    const toRebroadcast = findTransactionsToRebroadcast(this.transactions, transactions)

    const pending = this.transactions.filter(isPending)
    await Promise.all(pending.map(({ txid }) => getAndStorePendingTransactionHex(txid)))

    rebroadcastTransactions(toRebroadcast.map(({ txid }) => txid))
    this.transactions = this.transactions.filter(
      (tx) => tx.confirmationTime || useWalletState.getState().pendingTransactions[tx.txid],
    )
    this.updateStore()

    return this.transactions
  }

  getPendingTransactions () {
    return this.transactions.filter((tx) => !tx.confirmationTime?.height)
  }

  async getReceivingAddress () {
    if (!this.wallet) throw Error('WALLET_NOT_READY')
    info('PeachWallet - getReceivingAddress - start')

    const result = await this.wallet.getAddress(AddressIndex.New)

    return result
  }

  async withdrawAll (address: string, feeRate?: number) {
    if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
    info('PeachWallet - withdrawAll - start')
    const drainWalletTransaction = await buildDrainWalletTransaction(address, feeRate)
    const finishedTransaction = await this.finishTransaction(drainWalletTransaction)
    return this.signAndBroadcastPSBT(finishedTransaction.psbt)
  }

  async finishTransaction<T extends TxBuilder | BumpFeeTxBuilder> (transaction: T): Promise<ReturnType<T['finish']>> {
    if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
    info('PeachWallet - finishTransaction - start')
    try {
      // @ts-ignore exposed interface works, but internally it's struggling
      return await transaction.finish(this.wallet)
    } catch (e) {
      throw handleTransactionError(parseError(e))
    }
  }

  async signAndBroadcastPSBT (psbt: PartiallySignedTransaction) {
    if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
    info('PeachWallet - signAndBroadcastPSBT - start')
    try {
      const signedPSBT = await this.wallet.sign(psbt)
      info('PeachWallet - signAndBroadcastPSBT - signed')

      this.blockchain.broadcast(await signedPSBT.extractTx())
      info('PeachWallet - signAndBroadcastPSBT - broadcasted')
      this.syncWallet()

      info('PeachWallet - signAndBroadcastPSBT - end')

      return psbt
    } catch (e) {
      throw handleTransactionError(parseError(e))
    }
  }

  loadWalletStore (): void {
    this.transactions = useWalletState.getState().transactions
    this.balance = useWalletState.getState().balance
  }

  loadFromStorage (): void {
    if (useWalletState.persist.hasHydrated()) {
      this.loadWalletStore()
    } else {
      useWalletState.persist.onFinishHydration(() => {
        this.loadWalletStore()
      })
    }
  }
}
