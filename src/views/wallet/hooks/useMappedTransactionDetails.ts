import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { Transaction } from 'bitcoinjs-lib'
import { useEffect, useState } from 'react'

type Props = {
  localTx?: TransactionDetails
}
export const useMappedTransactionDetails = ({ localTx }: Props) => {
  const [transactionDetails, setTransactionDetails] = useState<Transaction>()

  useEffect(() => {
    (async () => {
      if (!localTx?.transaction) return

      const serialized = await localTx.transaction.serialize()
      const transaction = Transaction.fromBuffer(Buffer.from(serialized))
      setTransactionDetails(transaction)
    })()
  }, [localTx])

  return transactionDetails
}
