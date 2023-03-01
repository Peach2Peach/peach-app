import { address, Transaction } from 'bitcoinjs-lib'
import { getNetwork } from '../wallet'

export const getTradeBreakdown = (releaseTransaction: string, releaseAddress: string, inputAmount: number) => {
  const transactionDetails = Transaction.fromHex(releaseTransaction)
  console.log('TransactionDetails', transactionDetails)
  const outputs = transactionDetails.outs
  console.log('Outputs', outputs)
  const releaseOutput = outputs.find(
    (output) => address.fromOutputScript(output.script, getNetwork()) === releaseAddress,
  )
  console.log('ReleaseOutput', releaseOutput)
  if (!releaseOutput) return { totalAmount: 0, peachFee: 0, networkFee: 0, amountReceived: 0 }
  const peachFeeOutput = outputs.find(
    (output) => address.fromOutputScript(output.script, getNetwork()) !== releaseAddress,
  ) || { value: 0 }
  console.log('PeachFeeOutput', peachFeeOutput)
  const networkFee = inputAmount - peachFeeOutput.value - releaseOutput.value
  console.log('NetworkFee', networkFee)
  return {
    totalAmount: inputAmount,
    peachFee: peachFeeOutput.value,
    networkFee,
    amountReceived: releaseOutput.value,
  }
}
