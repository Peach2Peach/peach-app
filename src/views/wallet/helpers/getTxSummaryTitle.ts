import { tolgee } from "../../../tolgee";

export const getTxSummaryTitle = (type: TransactionType) =>
  tolgee.t(`wallet.transactionSummary.type.${type}`, { ns: "wallet" });
