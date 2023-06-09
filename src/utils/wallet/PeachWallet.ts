import { NETWORK } from '@env'
import { Address, Blockchain, DatabaseConfig, Descriptor, TxBuilder, Wallet } from 'bdk-rn'
import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { AddressIndex, BlockChainNames, BlockchainEsploraConfig, KeychainKind, Network } from 'bdk-rn/lib/lib/enums'
import { BIP32Interface } from 'bip32'
import { settingsStore } from '../../store/settingsStore'
import { tradeSummaryStore } from '../../store/tradeSummaryStore'
import { getBuyOfferIdFromContract } from '../contract'
import { info } from '../log'
import { parseError } from '../result'
import { isPending } from '../transaction'
import { findTransactionsToRebroadcast } from '../transaction/findTransactionsToRebroadcast'
import { mergeTransactionList } from '../transaction/mergeTransactionList'
import { callWhenInternet } from '../web'
import { PeachJSWallet } from './PeachJSWallet'
import { handleBroadcastError } from './error/handleBroadcastError'
import { getAndStorePendingTransactionHex } from './getAndStorePendingTransactionHex'
import { getDescriptorSecretKey } from './getDescriptorSecretKey'
import { rebroadcastTransactions } from './rebroadcastTransactions'
import { walletStore } from './walletStore'
import { buildDrainWalletTransaction } from './transaction/buildDrainWalletTransaction'

type PeachWalletProps = {
  wallet: BIP32Interface
  network?: BitcoinNetwork
  gapLimit?: number
}

export class PeachWallet extends PeachJSWallet {
  initialized: boolean

  synced: boolean

  descriptorPath: string

  balance: number

  transactions: TransactionDetails[]

  network: Network

  wallet: Wallet | undefined

  blockchain: Blockchain | undefined

  constructor ({ wallet, network = NETWORK, gapLimit = 25 }: PeachWalletProps) {
    super({ wallet, network, gapLimit })
    this.network = network as Network
    this.descriptorPath = `/84\'/${network === 'bitcoin' ? '0' : '1'}\'/0\'/0/*`
    this.balance = 0
    this.transactions = []
    this.initialized = false
    this.synced = false
  }

  async loadWallet (seedphrase?: string): Promise<void> {
    this.loadFromStorage()

    return new Promise((resolve) =>
      callWhenInternet(async () => {
        const nodeURL = settingsStore.getState().nodeURL
        info('PeachWallet - loadWallet - start')

        info('PeachWallet - loadWallet - createWallet')

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
          url: nodeURL,
          proxy: '',
          concurrency: '1',
          timeout: '5',
          stopGap: '5',
        }

        this.blockchain = await new Blockchain().create(config, BlockChainNames.Esplora)
        const dbConfig = await new DatabaseConfig().memory()

        this.wallet = await new Wallet().create(externalDescriptor, internalDescriptor, this.network, dbConfig)

        info('PeachWallet - loadWallet - createWallet')

        this.initialized = true

        this.syncWallet()

        info('PeachWallet - loadWallet - loaded')
        resolve()
      }),
    )
  }

  async syncWallet (): Promise<void> {
    return new Promise((resolve, reject) =>
      callWhenInternet(async () => {
        if (!this.wallet || !this.blockchain) return reject(new Error('WALLET_NOT_READY'))
        info('PeachWallet - syncWallet - start')
        this.synced = false

        const success = await this.wallet.sync(this.blockchain)
        if (success) {
          this.getBalance()
          this.getTransactions()
          this.synced = true
          info('PeachWallet - syncWallet - synced')
        }
        return resolve()
      }),
    )
  }

  updateStore (): void {
    walletStore.getState().setTransactions(this.transactions)
    this.transactions
      .filter(({ txid }) => !walletStore.getState().txOfferMap[txid])
      .forEach(({ txid }) => {
        const sellOffer = tradeSummaryStore.getState().offers.find((offer) => offer.txId === txid)
        if (sellOffer?.id) return walletStore.getState().updateTxOfferMap(txid, sellOffer.id)

        const contract = tradeSummaryStore.getState().contracts.find((cntrct) => cntrct.releaseTxId === txid)
        if (contract) return walletStore.getState().updateTxOfferMap(txid, getBuyOfferIdFromContract(contract))
        return null
      })
  }

  async getBalance (): Promise<number> {
    if (!this.wallet) throw Error('WALLET_NOT_READY')

    const balance = await this.wallet.getBalance()

    this.balance = Number(balance.total)
    walletStore.getState().setBalance(this.balance)
    return this.balance
  }

  async getTransactions (): Promise<TransactionDetails[]> {
    if (!this.wallet) throw Error('WALLET_NOT_READY')

    const transactions = await this.wallet.listTransactions()
    this.transactions = mergeTransactionList(this.transactions, transactions)
    const toRebroadcast = findTransactionsToRebroadcast(this.transactions, transactions)

    const pending = this.transactions.filter(isPending)
    await Promise.all(pending.map(({ txid }) => getAndStorePendingTransactionHex(txid)))

    await rebroadcastTransactions(toRebroadcast.map(({ txid }) => txid))
    this.transactions = this.transactions.filter(
      (tx) => tx.confirmationTime || walletStore.getState().pendingTransactions[tx.txid],
    )
    this.updateStore()

    return this.transactions
  }

  async getReceivingAddress () {
    if (!this.wallet) throw Error('WALLET_NOT_READY')
    info('PeachWallet - getReceivingAddress - start')

    const result = await this.wallet.getAddress(AddressIndex.New)

    return result
  }

  async withdrawAll (address: string, feeRate?: number): Promise<string | null> {
    if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
    info('PeachWallet - withdrawAll - start')
    try {
      const drainWalletTranasction = await buildDrainWalletTransaction(address, feeRate)

      const result = await drainWalletTranasction.finish(this.wallet)
      const signedPSBT = await this.wallet.sign(result.psbt)

      this.blockchain.broadcast(await signedPSBT.extractTx())
      this.syncWallet()

      info('PeachWallet - withdrawAll - end')

      return result.txDetails.txid
    } catch (e) {
      throw handleBroadcastError(parseError(e))
    }
  }

  async sendTo (address: string, amount: number, feeRate?: number): Promise<string | null> {
    if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
    info('PeachWallet - sendTo - start')
    try {
      const txBuilder = await new TxBuilder().create()
      if (feeRate) await txBuilder.feeRate(feeRate)
      await txBuilder.enableRbf()
      const recipientAddress = await new Address().create(address)
      await txBuilder.addRecipient(await recipientAddress.scriptPubKey(), amount)

      const result = await txBuilder.finish(this.wallet)
      const signedPSBT = await this.wallet.sign(result.psbt)

      this.blockchain.broadcast(await signedPSBT.extractTx())
      this.syncWallet()

      info('PeachWallet - sendTo - end')

      return result.txDetails.txid
    } catch (e) {
      throw handleBroadcastError(parseError(e))
    }
  }

  loadWalletStore (): void {
    this.transactions = walletStore.getState().transactions
    this.balance = walletStore.getState().balance
  }

  loadFromStorage (): void {
    if (walletStore.persist.hasHydrated()) {
      this.loadWalletStore()
    } else {
      walletStore.persist.onFinishHydration(() => {
        this.loadWalletStore()
      })
    }
  }
}
