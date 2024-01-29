import { NETWORK } from '@env'
import { Blockchain, BumpFeeTxBuilder, DatabaseConfig, PartiallySignedTransaction, TxBuilder, Wallet } from 'bdk-rn'
import { AddressInfo, TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { AddressIndex, BlockChainNames, Network } from 'bdk-rn/lib/lib/enums'
import { BIP32Interface } from 'bip32'
import RNFS from 'react-native-fs'
import { waitForHydration } from '../../store/waitForHydration'
import { error } from '../log/error'
import { info } from '../log/info'
import { parseError } from '../result/parseError'
import { isIOS } from '../system/isIOS'
import { callWhenInternet } from '../web/callWhenInternet'
import { PeachJSWallet } from './PeachJSWallet'
import { buildBlockchainConfig } from './buildBlockchainConfig'
import { handleTransactionError } from './error/handleTransactionError'
import { getDescriptorsBySeedphrase } from './getDescriptorsBySeedphrase'
import { getUTXOAddress } from './getUTXOAddress'
import { labelAddressByTransaction } from './labelAddressByTransaction'
import { mapTransactionToOffer } from './mapTransactionToOffer'
import { NodeConfig, useNodeConfigState } from './nodeConfigStore'
import { BuildTxParams, buildTransaction } from './transaction'
import { transactionHasBeenMappedToOffers } from './transactionHasBeenMappedToOffers'
import { useWalletState } from './walletStore'

type PeachWalletProps = {
  wallet: BIP32Interface
  network?: BitcoinNetwork
  gapLimit?: number
}

const defaultGapLimit = 25
export class PeachWallet extends PeachJSWallet {
  initialized: boolean

  seedphrase: string | undefined

  syncInProgress: Promise<void> | undefined

  balance: number

  transactions: TransactionDetails[]

  wallet: Wallet | undefined

  lastUnusedAddress?: Omit<AddressInfo, 'address'> & {
    address: string
  }

  blockchain: Blockchain | undefined

  nodeType?: BlockChainNames

  constructor ({ wallet, network = NETWORK, gapLimit = defaultGapLimit }: PeachWalletProps) {
    super({ wallet, network, gapLimit })
    this.balance = 0
    this.transactions = []
    this.initialized = false
    this.syncInProgress = undefined
    this.seedphrase = undefined
  }

  initWallet (seedphrase = this.seedphrase): Promise<void> {
    this.loadFromStorage()

    console.log(seedphrase)
    return new Promise((resolve, reject) =>
      callWhenInternet(async () => {
        info('PeachWallet - initWallet - start')

        try {
          const { externalDescriptor, internalDescriptor } = await getDescriptorsBySeedphrase({
            seedphrase,
            network: this.getNetwork(),
          })

          this.setBlockchain(useNodeConfigState.getState())

          const dbConfig = await getDBConfig(this.getNetwork(), this.nodeType)

          info('PeachWallet - initWallet - createWallet')

          this.wallet = await new Wallet().create(externalDescriptor, internalDescriptor, this.getNetwork(), dbConfig)

          info('PeachWallet - initWallet - createdWallet')

          this.initialized = true

          info('PeachWallet - initWallet - loaded')
          return resolve()
        } catch (e) {
          error('PeachWallet - initWallet - error', parseError(e))
          return reject(new Error('GENERAL_ERROR'))
        }
      }),
    )
  }

  async loadWallet (seedphrase?: string) {
    this.seedphrase = seedphrase
    info('PeachWallet - loadWallet - start')
    await waitForHydration(useNodeConfigState)

    this.initWallet(seedphrase).then(() => {
      info('PeachWallet - loadWallet - finished')
    })
  }

  async setBlockchain (nodeConfig: NodeConfig) {
    info('PeachWallet - setBlockchain - start')
    const blockchainConfig = buildBlockchainConfig(nodeConfig)
    this.blockchain = await new Blockchain().create(blockchainConfig.config, blockchainConfig.type)
    this.nodeType = blockchainConfig.type
  }

  syncWallet () {
    if (this.syncInProgress) return this.syncInProgress

    this.syncInProgress = new Promise((resolve, reject) =>
      callWhenInternet(async () => {
        if (!this.wallet || !this.blockchain) return reject(new Error('WALLET_NOT_READY'))

        info('PeachWallet - syncWallet - start')
        useWalletState.getState().setIsSynced(false)

        try {
          const success = await this.wallet.sync(this.blockchain)
          if (success) {
            this.getBalance()
            this.getTransactions()
            this.lastUnusedAddress = undefined
            useWalletState.getState().setIsSynced(true)
            info('PeachWallet - syncWallet - synced')
          }

          this.syncInProgress = undefined
          return resolve()
        } catch (e) {
          error(parseError(e))
          return reject(new Error(parseError(e)))
        }
      }),
    )
    return this.syncInProgress
  }

  updateStore () {
    useWalletState.getState().setTransactions(this.transactions)
    this.transactions.filter((tx) => !transactionHasBeenMappedToOffers(tx)).forEach(mapTransactionToOffer)
    this.transactions.filter(transactionHasBeenMappedToOffers).forEach(labelAddressByTransaction)
  }

  async getBalance () {
    if (!this.wallet) throw Error('WALLET_NOT_READY')

    const balance = await this.wallet.getBalance()

    this.balance = Number(balance.total)
    useWalletState.getState().setBalance(this.balance)
    return this.balance
  }

  async getTransactions () {
    if (!this.wallet) throw Error('WALLET_NOT_READY')

    this.transactions = await this.wallet.listTransactions(true)
    this.updateStore()

    return this.transactions
  }

  getPendingTransactions () {
    return this.transactions.filter((tx) => !tx.confirmationTime?.height)
  }

  async fetchLastUnusedAddress () {
    if (!this.wallet) throw Error('WALLET_NOT_READY')
    const addressInfo = await this.wallet.getAddress(AddressIndex.LastUnused)
    this.lastUnusedAddress = {
      ...addressInfo,
      address: await addressInfo.address.asString(),
    }
    return this.lastUnusedAddress
  }

  async getAddress (index: AddressIndex | number = AddressIndex.New) {
    if (!this.wallet) throw Error('WALLET_NOT_READY')
    const addressInfo = await this.wallet.getAddress(index)
    return {
      ...addressInfo,
      address: await addressInfo.address.asString(),
    }
  }

  async getAddressByIndex (index: number) {
    const { index: lastUnusedIndex } = await this.getLastUnusedAddress()
    const address = await this.getAddress(index)
    return {
      index,
      used: index < lastUnusedIndex,
      address: address.address,
    }
  }

  getLastUnusedAddress () {
    if (!this.lastUnusedAddress) return this.fetchLastUnusedAddress()
    return this.lastUnusedAddress
  }

  async getInternalAddress (index: AddressIndex | number = AddressIndex.New) {
    if (!this.wallet) throw Error('WALLET_NOT_READY')
    const addressInfo = await this.wallet.getInternalAddress(index)
    return {
      ...addressInfo,
      address: await addressInfo.address.asString(),
    }
  }

  async getAddressUTXO (address: string) {
    if (!this.wallet) throw Error('WALLET_NOT_READY')

    const utxo = await this.wallet.listUnspent()
    const utxoAddresses = await Promise.all(utxo.map(getUTXOAddress(this.getNetwork())))
    return utxo.filter((utx, i) => utxoAddresses[i] === address)
  }

  async buildFinishedTransaction (buildParams: BuildTxParams) {
    if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
    info('PeachWallet - buildFinishedTransaction - start')

    const transaction = await buildTransaction(buildParams)

    return this.finishTransaction(transaction)
  }

  async sendTo (buildParams: BuildTxParams) {
    const { psbt } = await this.buildFinishedTransaction(buildParams)
    return this.signAndBroadcastPSBT(psbt)
  }

  async finishTransaction<T extends TxBuilder | BumpFeeTxBuilder>(transaction: T): Promise<ReturnType<T['finish']>>

  async finishTransaction (transaction: TxBuilder | BumpFeeTxBuilder) {
    if (!this.wallet || !this.blockchain) throw Error('WALLET_NOT_READY')
    info('PeachWallet - finishTransaction - start')
    try {
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

      this.syncWallet().catch((e) => {
        error(parseError(e))
      })

      info('PeachWallet - signAndBroadcastPSBT - end')

      return psbt
    } catch (e) {
      throw handleTransactionError(parseError(e))
    }
  }

  loadWalletStore () {
    this.transactions = useWalletState.getState().transactions
    this.balance = useWalletState.getState().balance
  }

  async loadFromStorage () {
    await waitForHydration(useWalletState)
    this.loadWalletStore()
  }
}

function getDBConfig (network: Network, nodeType: BlockChainNames = BlockChainNames.Electrum) {
  if (isIOS()) return new DatabaseConfig().memory()
  const dbName = `peach-${network}${nodeType}`
  const directory = `${RNFS.DocumentDirectoryPath}/${dbName}`
  return new DatabaseConfig().sqlite(directory)
}
