import { PeachWallet } from "../../../utils/wallet/PeachWallet";

export const canBumpNetworkFees = (
  peachWallet: PeachWallet,
  transaction: TransactionSummary,
) =>
  !transaction.confirmed &&
  peachWallet.transactions
    .filter((tx) => !tx.confirmationTime?.height)
    .some(({ txid, sent }) => txid === transaction.id && sent > 0);
