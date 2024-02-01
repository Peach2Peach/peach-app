import i18n from "../../../utils/i18n";

export const getTxSummaryTitle = (type: TransactionType) =>
  i18n(`wallet.transactionSummary.type.${type}`);
