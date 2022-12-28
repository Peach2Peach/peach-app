import { BLOCKEXPRLORER, NETWORK } from '@env'
import BdkRn from 'bdk-rn'
import { error } from '../log'
import { walletStore } from './walletStore'

type PeachWalletProps = {
  network?: BitcoinNetwork
  gapLimit?: number
}

export class PeachWallet {
  initialized: boolean

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
  }

  async loadWallet (seedphrase?: string) {
    let mnemonic = seedphrase
    if (!mnemonic) {
      const generateMnemonicResult = await BdkRn.generateMnemonic({
        length: 12,
        network: this.network,
      })
      mnemonic = generateMnemonicResult.data
    }

    const response = await BdkRn.createWallet({
      mnemonic,
      password: '',
      network: this.network,
      blockChainConfigUrl: BLOCKEXPRLORER, // TODO get user config
      blockChainName: 'ESPLORA',
    })
    if (response.error) {
      throw new Error(response.data)
    }
    this.balance = response.data.balance || 0
    this.initialized = true

    this.updateStore()
    BdkRn.syncWallet()
  }

  updateStore (): void {
    walletStore.getState().setBalance(this.balance)
  }

  async getBalance (): Promise<number> {
    const getBalanceResult = await BdkRn.getBalance()
    if (getBalanceResult.error) {
      error(getBalanceResult.data)
      return this.balance
    }
    this.balance = getBalanceResult.data
    this.updateStore()

    return this.balance
  }

  async getReceivingAddress (): Promise<string> {
    if (!this.initialized) throw Error('WALLET_NOT_READY')
    const response = await BdkRn.getNewAddress()
    return response.data
  }

  async withdrawAll (address: string): Promise<string> {
    const broadcastTxResult = await BdkRn.broadcastTx({ address, amount: await this.getBalance() })

    if (broadcastTxResult.error) {
      error(broadcastTxResult.data)
    }
    this.getBalance()
    return broadcastTxResult.data
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
