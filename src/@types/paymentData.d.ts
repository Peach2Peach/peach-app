type PaymentDataField =
  | "accountNumber"
  | "accountType"
  | "alias"
  | "aliasType"
  | "bankAccountNumber"
  | "bankBranch"
  | "bankCode"
  | "bankName"
  | "beneficiary"
  | "beneficiaryAddress"
  | "bic"
  | "branchCode"
  | "branchName"
  | "bsbNumber"
  | "cedulaID"
  | "DNI"
  | "email"
  | "iban"
  | "lnurlAddress"
  | "mobileMoneyIdentifier"
  | "name"
  | "nameTag"
  | "phone"
  | "pixAlias"
  | "postePayNumber"
  | "receiveAddress"
  | "reference"
  | "residentialAddress"
  | "routingDetails"
  | "RUT"
  | "steamFriendCode"
  | "ukBankAccount"
  | "ukSortCode"
  | "userId"
  | "userName"
  | "wallet";

type PaymentDataInfo = Partial<Record<PaymentDataField, string>>;

type PaymentData = PaymentDataInfo & {
  id: string;
  label: string;
  type: PaymentMethod;
  currencies: Currency[];
  country?: PaymentMethodCountry;
  hidden?: boolean;
  reference?: string;
};
