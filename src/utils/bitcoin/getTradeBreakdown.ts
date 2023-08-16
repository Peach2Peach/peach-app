import { address, Transaction } from 'bitcoinjs-lib'
import { log } from '../log'
import { getNetwork } from '../wallet'

type Props = { releaseTransaction: string; releaseAddress: string; inputAmount: number; discount?: number }
export const getTradeBreakdown = ({ releaseTransaction, releaseAddress, inputAmount, discount = 0 }: Props) => {
  try {
    const transaction = Transaction.fromHex(releaseTransaction)
    const outputs = transaction.outs
    const releaseOutput = outputs.find(
      (output) => address.fromOutputScript(output.script, getNetwork()) === releaseAddress,
    )
    if (!releaseOutput) return { totalAmount: 0, peachFee: 0, networkFee: 0, amountReceived: 0 }

    const peachFeeOutput = outputs.find(
      (output) => address.fromOutputScript(output.script, getNetwork()) !== releaseAddress,
    ) || { value: 0 }
    const networkFee = inputAmount - peachFeeOutput.value - releaseOutput.value
    const feeRate = networkFee / transaction.virtualSize()
    const absoluteDiscount = Math.ceil(discount * feeRate)

    return {
      totalAmount: inputAmount,
      peachFee: peachFeeOutput.value,
      networkFee: networkFee - absoluteDiscount,
      amountReceived: releaseOutput.value + absoluteDiscount,
    }
  } catch (error) {
    log('error', 'Error getting trade breakdown: ', error, '\n for this tx: ', releaseTransaction)
    return { totalAmount: 0, peachFee: 0, networkFee: 0, amountReceived: 0 }
  }
}
