import { Psbt } from 'bitcoinjs-lib'
import { ceil } from '../../../utils/math'
import { MAXMININGFEE } from '../../../constants'

/**
 * @description Check if buyer receives agreed amount minus peach fees
 */
export const releaseTransactionHasValidOutputs = (psbt: Psbt, contract: Contract, peachFee: number) => {
  const buyerFee = contract.buyerFee ?? peachFee
  const buyerOutput = psbt.txOutputs.find((output) => output.address === contract.releaseAddress)
  const peachFeeOutput = psbt.txOutputs.find((output) => output.address !== contract.releaseAddress)

  if (!buyerOutput) return false

  if (
    buyerFee > 0
    && (!peachFeeOutput
      || peachFeeOutput.value !== ceil(contract.amount * buyerFee)
      || buyerOutput.value < contract.amount - peachFeeOutput.value - MAXMININGFEE)
  ) {
    return false
  }

  if (buyerOutput.value < contract.amount - MAXMININGFEE) return false

  return true
}
