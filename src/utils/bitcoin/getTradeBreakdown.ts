import { Psbt } from 'bitcoinjs-lib'
import { getNetwork } from '../wallet'

export const getTradeBreakdown = (releaseTransaction: string, releaseAddress: string, inputAmount: number) => {
  const psbt = Psbt.fromBase64(releaseTransaction, { network: getNetwork() })

  const outputs = psbt.txOutputs
  const releaseOutput = outputs.find((output) => output.address === releaseAddress)
  if (!releaseOutput) return { totalAmount: 0, peachFee: 0, networkFee: 0, amountReceived: 0 }
  const peachFeeOutput = outputs.find((output) => output.address !== releaseAddress) || { value: 0 }
  const networkFee = inputAmount - peachFeeOutput.value - releaseOutput.value

  return {
    totalAmount: inputAmount,
    peachFee: peachFeeOutput.value,
    networkFee,
    amountReceived: releaseOutput.value,
  }
}
