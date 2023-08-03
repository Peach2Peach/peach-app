import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'

export const isPending = (tx: TransactionDetails) => !tx.confirmationTime?.height
