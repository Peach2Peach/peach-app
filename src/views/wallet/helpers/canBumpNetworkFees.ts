import { PeachWallet } from '../../../utils/wallet/PeachWallet'

export const canBumpNetworkFees = (peachWallet: PeachWallet, transaction?: TransactionSummary) =>
  transaction
  && !transaction.confirmed
  && peachWallet.getPendingTransactions().find(({ txid }) => txid === transaction.id)
