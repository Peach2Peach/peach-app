import { NETWORK } from '@env'
import NetInfo from '@react-native-community/netinfo'
import BdkRn from 'bdk-rn'
import { TransactionsResponse } from 'bdk-rn/lib/lib/interfaces'
import { BIP32Interface } from 'bip32'
import { payments } from 'bitcoinjs-lib'
import { sign } from 'bitcoinjs-message'
import { settingsStore } from '../../store/settingsStore'
import { tradeSummaryStore } from '../../store/tradeSummaryStore'
import { getBuyOfferIdFromContract } from '../contract'
import { error, info } from '../log'
import { getNetwork } from './getNetwork'
import { PeachWalletErrorHandlers } from './PeachWalletErrorHandlers'
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

  transactions: TransactionsResponse

  network: BitcoinNetwork

  wallet: BIP32Interface

  gapLimit: number

  addresses: string[]

  constructor ({ wallet, network = NETWORK, gapLimit = 25 }: PeachWalletProps) {
    super()
    this.wallet = wallet
    this.network = network
    this.gapLimit = gapLimit
    this.addresses = []
    this.derivationPath = `m/84\'/${NETWORK === 'bitcoin' ? '0' : '1'}\'/0\'`
    this.descriptorPath = `/84\'/${NETWORK === 'bitcoin' ? '0' : '1'}\'/0\'/0/*`
    this.balance = 0
    this.transactions = { confirmed: [], pending: [] }
    this.initialized = false
    this.synced = false
  }

  static async checkConnection (callback: Function) {
    const netInfo = await NetInfo.fetch()
    if (netInfo.isInternetReachable) {
      callback()
    } else {
      const unsubscribe = NetInfo.addEventListener((state) => {
        if (!state.isInternetReachable) return
        callback()
        unsubscribe()
      })
    }
  }

  async getDescriptor (mnemonic: string): Promise<string> {
    const result = await BdkRn.createDescriptor({
      type: 'wpkh',
      mnemonic,
      password: '',
      path: this.descriptorPath,
      network: this.network,
    })
    if (result.isErr()) {
      throw result.error
    }

    return result.value
  }

  async loadWallet (seedphrase?: string) {
    PeachWallet.checkConnection(async () => {
      const nodeURL = settingsStore.getState().nodeURL
      info('PeachWallet - loadWallet - start')

      let mnemonic = seedphrase
      if (!mnemonic) {
        info('PeachWallet - loadWallet - generateMnemonic')
        const generateMnemonicResult = await BdkRn.generateMnemonic({
          length: 12,
          network: this.network,
        })
        if (generateMnemonicResult.isErr()) {
          throw generateMnemonicResult.error
        }
        mnemonic = generateMnemonicResult.value
      }

      info('PeachWallet - loadWallet - createWallet')

      const descriptor = await this.getDescriptor(mnemonic)
      const result = await BdkRn.createWallet({
        descriptor,
        network: this.network,
        blockChainConfigUrl: nodeURL,
        retry: '5',
        timeOut: '5',
        blockChainName: 'ESPLORA',
      })
      info('PeachWallet - loadWallet - createWallet')

      if (result.isErr()) {
        throw result.error
      }

      this.initialized = true
      this.preloadAddresses()
      this.getBalance()
      this.getTransactions()

      this.syncWallet()

      info('PeachWallet - loadWallet - loaded')
    })
  }

  async syncWallet () {
    PeachWallet.checkConnection(async () => {
      info('PeachWallet - syncWallet - start')
      this.synced = false

      const result = await BdkRn.syncWallet()
      if (!result.isErr()) {
        this.getBalance()
        this.getTransactions()
        this.synced = true
        info('PeachWallet - syncWallet - synced')
      }
    })
  }

  updateStore (): void {
    walletStore.getState().setAddresses(this.addresses)
    walletStore.getState().setSynced(this.synced)
    walletStore.getState().setBalance(this.balance)
    walletStore.getState().setTransactions(this.transactions)
    ;[...this.transactions.confirmed, ...this.transactions.pending]
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
    const result = await BdkRn.getBalance()
    if (result.isErr()) {
      error(result.error)
      return this.balance
    }
    this.balance = Number(result.value)
    this.updateStore()

    return this.balance
  }

  async getTransactions (): Promise<TransactionsResponse> {
    const result = await BdkRn.getTransactions()
    if (result.isErr()) {
      error(result.error)
      return this.transactions
    }
    this.transactions = result.value
    this.updateStore()

    return this.transactions
  }

  async getReceivingAddress (): Promise<string> {
    info('PeachWallet - getReceivingAddress - start')
    if (!this.initialized) throw Error('WALLET_NOT_READY')

    const result = await BdkRn.getNewAddress()

    if (result.isErr()) {
      throw result.error
    }

    this.updateStore()

    return result.value
  }

  async withdrawAll (address: string, feeRate?: number): Promise<string | null> {
    info('PeachWallet - withdrawAll - start')
    if (!this.initialized) throw Error('WALLET_NOT_READY')
    const broadcastTxResult = await BdkRn.drainWallet({ address, feeRate })

    if (broadcastTxResult.isErr()) {
      throw PeachWallet.handleBroadcastError(broadcastTxResult, feeRate)
    }

    this.syncWallet()
    info('PeachWallet - withdrawAll - end')

    return broadcastTxResult.value
  }

  getKeyPair (index: number): BIP32Interface {
    return this.wallet.derivePath(this.derivationPath + `/0/${index}`)
  }

  preloadAddresses (): void {
    this.addresses = walletStore.getState().addresses
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
