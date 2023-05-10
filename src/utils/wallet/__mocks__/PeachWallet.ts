/* eslint-disable class-methods-use-this */
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

  async getReceivingAddress (): Promise<string | null> {
    return 'receivingAddress'
  }

  async withdrawAll (): Promise<string | null> {
    return 'txId'
  }

  signMessage () {
    return 'signature'
  }
}
