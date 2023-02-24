import { ConfirmedTransaction, PendingTransaction } from 'bdk-rn/lib/lib/interfaces'

export const txIsConfirmed = (tx: ConfirmedTransaction | PendingTransaction): tx is ConfirmedTransaction =>
  'block_height' in tx || 'confirmation_time' in tx
