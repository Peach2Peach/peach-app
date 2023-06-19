/* eslint-disable class-methods-use-this, require-await */
import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { TransactionsResponse } from 'bdk-rn/lib/lib/interfaces'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { PartiallySignedTransaction } from 'bdk-rn'

export class PeachWallet {
  balance: number

  constructor () {
    this.balance = 0
  }

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
    return { address: 'bcrt1qwype5wug33a6hwz9u2n6vz4lc0kpw0kg4xc8fq', index: 0 }
  }

  async withdrawAll (): Promise<string | null> {
    return 'txId'
  }

  async sendTo (address: string, amount: number, feeRate = 1): Promise<TxBuilderResult> {
    return getTransactionDetails(amount, feeRate)
  }

  async finishTransaction () {
    return getTransactionDetails()
  }

  async signAndBroadcastPSBT (psbt: PartiallySignedTransaction) {
    return psbt
  }

  findKeyPairByAddress () {
    return undefined
  }

  signMessage () {
    // message: I confirm that only I, peach02d13a5d, control the address bcrt1qwype5wug33a6hwz9u2n6vz4lc0kpw0kg4xc8fq
    return 'IH9ZjMHG1af6puAITFTdV5RSYoK1MNmecZdhW0s4soh4EIAz4igtVQTec5yj4H9Iy7sB6qYReRjGpE3b4OoXSLY'
  }
}
