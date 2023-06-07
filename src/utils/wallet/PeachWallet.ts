import { NETWORK } from '@env'
import {
  Address,
  Blockchain,
  DatabaseConfig,
  Descriptor,
  DescriptorSecretKey,
  Mnemonic,
  TxBuilder,
  Wallet,
} from 'bdk-rn'
import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import {
  AddressIndex,
  BlockChainNames,
  BlockchainEsploraConfig,
  KeychainKind,
  Network,
  WordCount,
} from 'bdk-rn/lib/lib/enums'
import { BIP32Interface } from 'bip32'
import { payments } from 'bitcoinjs-lib'
import { sign } from 'bitcoinjs-message'
import { settingsStore } from '../../store/settingsStore'
import { tradeSummaryStore } from '../../store/tradeSummaryStore'
import { getBuyOfferIdFromContract } from '../contract'
import { info } from '../log'
import { isPending } from '../transaction'
import { findTransactionsToRebroadcast } from '../transaction/findTransactionsToRebroadcast'
import { mergeTransactionList } from '../transaction/mergeTransactionList'
import { checkConnection } from '../web'
import { PeachWalletErrorHandlers } from './PeachWalletErrorHandlers'
import { getAndStorePendingTransactionHex } from './getAndStorePendingTransactionHex'
import { getNetwork } from './getNetwork'
import { rebroadcastTransactions } from './rebroadcastTransactions'
import { walletStore } from './walletStore'

type PeachWalletProps = {
  wallet: BIP32Interface
  network?: BitcoinNetwork
  gapLimit?: number
}

export class PeachWallet extends PeachWalletErrorHandlers {
  initialized: boolean

  synced: boolean

  derivationPath: string

  descriptorPath: string

  balance: number

  transactions: TransactionDetails[]

  network: Network

  wallet: Wallet | undefined

  jsWallet: BIP32Interface

  blockchain: Blockchain | undefined

  gapLimit: number

  addresses: string[]

  constructor ({ wallet, network = NETWORK, gapLimit = 25 }: PeachWalletProps) {
    super()
    this.network = network as Network
    this.gapLimit = gapLimit
    this.jsWallet = wallet
    this.addresses = []
    this.derivationPath = `m/84\'/${NETWORK === 'bitcoin' ? '0' : '1'}\'/0\'`
    this.descriptorPath = `/84\'/${NETWORK === 'bitcoin' ? '0' : '1'}\'/0\'/0/*`
    this.balance = 0
    this.transactions = []
    this.initialized = false
    this.synced = false
  }

  static async getDescriptor (network: Network, seedphrase?: string): Promise<DescriptorSecretKey> {
    const mnemonic = await new Mnemonic().create(WordCount.WORDS12)

    if (seedphrase) await mnemonic.fromString(seedphrase)

    return await new DescriptorSecretKey().create(network, mnemonic)
  }

  async loadWallet (seedphrase?: string) {
    this.loadFromStorage()

    checkConnection(async () => {
      const nodeURL = settingsStore.getState().nodeURL
      info('PeachWallet - loadWallet - start')

      info('PeachWallet - loadWallet - createWallet')

      const descriptorSecretKey = await PeachWallet.getDescriptor(this.network, seedphrase)
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
    })
  }

  async syncWallet (callback?: (result: Awaited<boolean>) => void) {
    checkConnection(async () => {
      if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
      info('PeachWallet - syncWallet - start')
      this.synced = false

      const success = await this.wallet.sync(this.blockchain)
      if (success) {
        this.getBalance()
        this.getTransactions()
        this.synced = true
        walletStore.getState().setSynced(this.synced)
        info('PeachWallet - syncWallet - synced')
      }
      if (callback) callback(success)
    })
  }

  updateStore (): void {
    walletStore.getState().setSynced(this.synced)
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
    this.updateStore()

    return this.transactions
  }

  async getReceivingAddress (): Promise<string> {
    info('PeachWallet - getReceivingAddress - start')
    if (!this.wallet) throw Error('WALLET_NOT_READY')

    const result = await this.wallet.getAddress(AddressIndex.New)
    this.updateStore()

    return result.address
  }

  // eslint-disable-next-line max-statements
  async withdrawAll (address: string, feeRate?: number): Promise<string | null> {
    if (!this.wallet) throw Error('WALLET_NOT_READY')
    info('PeachWallet - withdrawAll - start')

    const txBuilder = await new TxBuilder().create()
    if (feeRate) await txBuilder.feeRate(feeRate)
    await txBuilder.enableRbf()
    const recipientAddress = await new Address().create(address)
    const utxos = await this.wallet.listUnspent()
    await txBuilder.addUtxos(utxos.map((utxo) => utxo.outpoint))
    await txBuilder.drainTo(await recipientAddress.scriptPubKey())
    const result = await txBuilder.finish(this.wallet)
    const signedPSBT = await this.wallet.sign(result.psbt)
    this.blockchain?.broadcast(await signedPSBT.extractTx())
    this.syncWallet()
    info('PeachWallet - withdrawAll - end')

    return result.txDetails.txid
  }

  getKeyPair (index: number): BIP32Interface {
    return this.jsWallet.derivePath(this.derivationPath + `/0/${index}`)
  }

  loadWalletStore (): void {
    this.addresses = walletStore.getState().addresses
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

  getAddress (index: number): string | undefined {
    info('PeachWallet - getAddress', index)

    if (this.addresses[index]) return this.addresses[index]

    const keyPair = this.getKeyPair(index)
    const p2wpkh = payments.p2wpkh({
      network: getNetwork(),
      pubkey: keyPair.publicKey,
    })

    if (p2wpkh.address) this.addresses[index] = p2wpkh.address

    return p2wpkh.address
  }

  findKeyPairByAddress (address: string): BIP32Interface | null {
    info('PeachWallet - findKeyPairByAddress - start')

    const limit = this.addresses.length + this.gapLimit
    for (let i = 0; i <= limit; i++) {
      info('PeachWallet - findKeyPairByAddress - scanning', i)

      const candidate = this.getAddress(i)
      if (address === candidate) {
        walletStore.getState().setAddresses(this.addresses)
        return this.getKeyPair(i)
      }
    }

    walletStore.getState().setAddresses(this.addresses)
    return null
  }

  signMessage (message: string, address: string): string {
    info('PeachWallet - signMessage - start')

    const keyPair = this.findKeyPairByAddress(address)
    if (!keyPair?.privateKey) throw Error('Address not part of wallet')
    const signature = sign(message, keyPair.privateKey, true)

    info('PeachWallet - signMessage - end')

    return signature.toString('base64')
  }
}
