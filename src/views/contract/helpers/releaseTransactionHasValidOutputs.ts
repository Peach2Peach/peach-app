import { Psbt } from 'bitcoinjs-lib'
import { ceil } from '../../../utils/math'
import { MAXMININGFEE } from '../../../constants'

/**
 * @description Check if buyer receives agreed amount minus peach fees
 */
export const releaseTransactionHasValidOutputs = (psbt: Psbt, contract: Contract, peachFee: number) => {
  const buyerFee = contract.buyerFee ?? peachFee

  const buyerOutput = psbt.txOutputs.find((output) => output.address === contract.releaseAddress)
  if (buyerFee > 0) {
    const peachFeeOutput = psbt.txOutputs.find((output) => output.address !== contract.releaseAddress)
    if (
      !peachFeeOutput
      || peachFeeOutput.value !== ceil(contract.amount * buyerFee)
      || !buyerOutput
      || buyerOutput.value < contract.amount - peachFeeOutput.value - MAXMININGFEE
    ) {
      return false
    }
  } else if (!buyerOutput || buyerOutput.value < contract.amount - MAXMININGFEE) {
    return false
  }

  return true
}
