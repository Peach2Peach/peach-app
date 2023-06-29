import { PeachWallet } from '../../../utils/wallet/PeachWallet'

export const canBumpNetworkFees = (peachWallet: PeachWallet, transaction: TransactionSummary) =>
  !transaction.confirmed && peachWallet.getPendingTransactions().some(({ txid }) => txid === transaction.id)
