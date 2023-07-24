import { Psbt } from 'bitcoinjs-lib'
import { ceil } from '../../../utils/math'
import { SIGHASH } from '../../../utils/bitcoin/constants'

const psbtIsForBatch = (psbt: Psbt) =>
  psbt.data.inputs.every((input) => input.sighashType === SIGHASH.SINGLE_ANYONECANPAY)

/**
 * @description Check if buyer receives agreed amount minus peach fees
 */
export const releaseTransactionHasValidOutputs = (psbt: Psbt, contract: Contract, peachFee: number) => {
  const batchMode = psbtIsForBatch(psbt)
  const buyerFee = contract.buyerFee ?? peachFee
  const buyerOutput = psbt.txOutputs.find((output) => output.address === contract.releaseAddress)
  const peachFeeOutput = psbt.txOutputs.find((output) => output.address !== contract.releaseAddress)

  if (psbt.txOutputs.length > 2) return false
  if (!buyerOutput) return false

  if ((buyerFee === 0 || batchMode) && psbt.txOutputs.length !== 1) return false

  if (buyerFee > 0 && !batchMode) {
    if (!peachFeeOutput || peachFeeOutput.value !== ceil(contract.amount * buyerFee) || buyerOutput.value === 0) {
      return false
    }
    return true
  }

  return true
}
