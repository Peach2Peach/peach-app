import { Psbt } from 'bitcoinjs-lib'
import { ceil } from '../../../utils/math'

/**
 * @description Check if buyer receives agreed amount minus peach fees
 */
export const releaseTransactionHasValidOutputs = (psbt: Psbt, contract: Contract, peachFee: number) => {
  const buyerFee = contract.buyerFee ?? peachFee
  const buyerOutput = psbt.txOutputs.find((output) => output.address === contract.releaseAddress)
  const peachFeeOutput = psbt.txOutputs.find((output) => output.address !== contract.releaseAddress)

  if (psbt.txOutputs.length > 2) return false
  if (!buyerOutput) return false

  if (buyerFee === 0 && psbt.txOutputs.length !== 1) return false

  if (buyerFee > 0) {
    if (!peachFeeOutput || peachFeeOutput.value !== ceil(contract.amount * buyerFee) || buyerOutput.value === 0) {
      return false
    }
    return true
  }

  return true
}
