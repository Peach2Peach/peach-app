import { peachWallet } from "../../../utils/wallet/setWallet";

export const canBumpNetworkFees = (transaction: TransactionSummary) => {
  if (!peachWallet) throw new Error("PeachWallet not set");

  return (
    !transaction.confirmed &&
    peachWallet.transactions
      .filter((tx) => !tx.confirmationTime?.height)
      .some(({ txid, sent }) => txid === transaction.id && sent > 0)
  );
};
