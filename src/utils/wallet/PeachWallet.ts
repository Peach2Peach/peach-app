import { BLOCKEXPRLORER, NETWORK } from '@env'
import BdkRn from 'bdk-rn'
import { error, info } from '../log'
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

  network: BitcoinNetwork

  gapLimit: number

  constructor ({ network = NETWORK, gapLimit = 25 }: PeachWalletProps) {
    this.network = network
    this.gapLimit = gapLimit
    this.derivationPath = 'm/84\'/0\'/0\''
    this.balance = 0
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

    const response = await BdkRn.createWallet({
      mnemonic,
      password: '',
      network: this.network,
      blockChainConfigUrl: BLOCKEXPRLORER, // TODO get user config
      blockChainName: 'ESPLORA',
    })
    if (response.isErr()) {
      throw response.error
    }

    this.initialized = true
    this.getBalance()

    this.syncWallet()

    info('PeachWallet - loadWallet - loaded')
  }

  async syncWallet () {
    info('PeachWallet - syncWallet - start')

    const result = await BdkRn.syncWallet()
    if (!result.isErr()) {
      this.getBalance()
      this.synced = true
      info('PeachWallet - syncWallet - synced')
    }
  }

  updateStore (): void {
    walletStore.getState().setSynced(this.synced)
    walletStore.getState().setBalance(this.balance)
  }

  async getBalance (): Promise<number> {
    const getBalanceResult = await BdkRn.getBalance()
    if (getBalanceResult.isErr()) {
      error(getBalanceResult.error)
      return this.balance
    }
    this.balance = Number(getBalanceResult.value)
    this.updateStore()

    return this.balance
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
