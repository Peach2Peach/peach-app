export const PaymentDataInfoFields: PaymentDataField[] = [
  "wallet",
  "phone",
  "email",
  "userName",
  "beneficiary",
  "iban",
  "accountNumber",
  "bic",
  "name",
  "ukBankAccount",
  "ukSortCode",
  "receiveAddress",
  "lnurlAddress",
  "reference",
  "userId",
  "chipperTag",
  "eversendUserName",
  "pixAlias",
  "postePayNumber",
];

export type PaymentDetailInfo = Partial<
  Record<PaymentDataField, Record<string, string>>
>;
