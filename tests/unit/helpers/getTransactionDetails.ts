import { PartiallySignedTransaction } from 'bdk-rn'
import { BlockTime, TransactionDetails } from 'bdk-rn/lib/classes/Bindings'

export const getTransactionDetails = (amount = 10000, feeRate = 1) => {
  const psbt = new PartiallySignedTransaction('base64')
  const feeAmount = feeRate * 110
  psbt.feeRate = () => new Promise((resolve) => resolve(feeRate))
  psbt.feeAmount = () => new Promise((resolve) => resolve(feeAmount))

  return {
    psbt,
    txDetails: new TransactionDetails('txId', 0, amount, feeAmount, new BlockTime(1, 1)),
  }
}
