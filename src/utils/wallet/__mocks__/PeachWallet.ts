/* eslint-disable class-methods-use-this, require-await */
import { TransactionsResponse } from 'bdk-rn/lib/lib/interfaces'

export class PeachWallet {
  async loadWallet () {}

  async syncWallet () {}

  updateStore (): void {}

  async getBalance (): Promise<number> {
    return 0
  }

  async getTransactions (): Promise<TransactionsResponse> {
    return { confirmed: [], pending: [] }
  }

  async getReceivingAddress () {
    return { address: 'receivingAddress', index: 0 }
  }

  async withdrawAll (): Promise<string | null> {
    return 'txId'
  }

  findKeyPairByAddress () {
    return undefined
  }

  signMessage () {
    return 'signature'
  }
}
