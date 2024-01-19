import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { useEffect, useState } from 'react'
import { getTransactionFeeRate } from '../../../utils/bitcoin/getTransactionFeeRate'

type Props = {
  transaction?: TransactionDetails
}
export const useTxFeeRate = ({ transaction }: Props) => {
  const [feeRate, setFeeRate] = useState(1)

  useEffect(() => {
    if (!transaction) return
    getTransactionFeeRate(transaction).then(setFeeRate)
  }, [transaction])

  return feeRate
}
