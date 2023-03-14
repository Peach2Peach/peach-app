import { address, Transaction } from 'bitcoinjs-lib'
import { log } from '../log'
import { getNetwork } from '../wallet'

export const getTradeBreakdown = (releaseTransaction: string, releaseAddress: string, inputAmount: number) => {
  try {
    const outputs = Transaction.fromHex(releaseTransaction).outs
    const releaseOutput = outputs.find(
      (output) => address.fromOutputScript(output.script, getNetwork()) === releaseAddress,
    )
    if (!releaseOutput) return { totalAmount: 0, peachFee: 0, networkFee: 0, amountReceived: 0 }

    const peachFeeOutput = outputs.find(
      (output) => address.fromOutputScript(output.script, getNetwork()) !== releaseAddress,
    ) || { value: 0 }
    const networkFee = inputAmount - peachFeeOutput.value - releaseOutput.value
    return {
      totalAmount: inputAmount,
      peachFee: peachFeeOutput.value,
      networkFee,
      amountReceived: releaseOutput.value,
    }
  } catch (error) {
    log('error', 'Error getting trade breakdown: ', error, '\n for this tx: ', releaseTransaction)
    return { totalAmount: 0, peachFee: 0, networkFee: 0, amountReceived: 0 }
  }
}
