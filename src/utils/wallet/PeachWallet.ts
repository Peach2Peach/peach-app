import { BLOCKEXPRLORER, NETWORK } from '@env'
import BdkRn from 'bdk-rn'
import { TransactionsResponse } from 'bdk-rn/lib/lib/interfaces'
import { account } from '../account'
import { getBuyOfferIdFromContract } from '../contract'
import { error, info } from '../log'
import { isSellOffer } from '../offer'
import { walletStore } from './walletStore'

type PeachWalletProps = {
  network?: BitcoinNetwork
  gapLimit?: number
}

export class PeachWallet {
  initialized: boolean

  synced: boolean

  derivationPath: string

  balance: number

  transactions: TransactionsResponse

  network: BitcoinNetwork

  gapLimit: number

  constructor ({ network = NETWORK, gapLimit = 25 }: PeachWalletProps) {
    this.network = network
    this.gapLimit = gapLimit
    this.derivationPath = 'm/84\'/0\'/0\''
    this.balance = 0
    this.transactions = { confirmed: [], pending: [] }
    this.initialized = false
    this.synced = false
  }

  async loadWallet (seedphrase?: string) {
    info('PeachWallet - loadWallet - start')

    let mnemonic = seedphrase
    if (!mnemonic) {
      const generateMnemonicResult = await BdkRn.generateMnemonic({
        length: 12,
        network: this.network,
      })
      if (generateMnemonicResult.isErr()) {
        throw generateMnemonicResult.error
      }
      mnemonic = generateMnemonicResult.value
    }

    const result = await BdkRn.createWallet({
      mnemonic,
      password: '',
      network: this.network,
      blockChainConfigUrl: BLOCKEXPRLORER, // TODO get user config
      blockChainName: 'ESPLORA',
    })
    if (result.isErr()) {
      throw result.error
    }

    this.initialized = true
    this.getBalance()
    this.getTransactions()

    this.syncWallet()

    info('PeachWallet - loadWallet - loaded')
  }

  async syncWallet () {
    info('PeachWallet - syncWallet - start')

    const result = await BdkRn.syncWallet()
    if (!result.isErr()) {
      this.getBalance()
      this.getTransactions()
      this.synced = true
      info('PeachWallet - syncWallet - synced')
    }
  }

  updateStore (): void {
    walletStore.getState().setSynced(this.synced)
    walletStore.getState().setBalance(this.balance)
    walletStore.getState().setTransactions(this.transactions)
    ;[...this.transactions.confirmed, ...this.transactions.pending]
      .filter(({ txid }) => !walletStore.getState().txOfferMap[txid])
      .forEach(({ txid }) => {
        const sellOffer = account.offers.find((offer) => isSellOffer(offer) && offer.txId === txid)
        if (sellOffer?.id) return walletStore.getState().updateTxOfferMap(txid, sellOffer.id)

        const contract = account.contracts.find((cntrct) => cntrct.releaseTxId === txid)
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

  async getReceivingAddress (): Promise<string | null> {
    info('PeachWallet - getReceivingAddress - start')
    if (!this.initialized) throw Error('WALLET_NOT_READY')

    const result = await BdkRn.getNewAddress()

    if (result.isErr()) {
      throw result.error
    }

    return result.value
  }

  async withdrawAll (address: string, feeRate?: number): Promise<string | null> {
    info('PeachWallet - withdrawAll - start')
    if (!this.initialized) throw Error('WALLET_NOT_READY')
    const broadcastTxResult = await BdkRn.drainWallet({ address, feeRate })

    if (broadcastTxResult.isErr()) {
      throw broadcastTxResult.error
    }

    this.getBalance()
    info('PeachWallet - withdrawAll - end')

    return broadcastTxResult.value
  }

  // getAddress (pk: BIP32Interface) {
  //   const payment = payments.p2wpkh({ pubkey: pk.publicKey, network: this.network })
  //   return payment.address
  // }

  // getChangeAddress (index: number): string | undefined {
  //   const pk = this.bip32Interface.derivePath(`${this.derivationPath}/1/${index}`)
  //   return this.getAddress(pk)
  // }

  // async watchAddresses (gapLimit = 25) {}

  // createWithdrawalTransaction (): PeachTransaction {
  //   return new PeachTransaction({ inputs: this.utxo })
  // }
}
