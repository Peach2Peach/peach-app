type PaymentDataField =
  | "accountNumber"
  | "bankAccountNumber"
  | "bankBranch"
  | "bankName"
  | "bankNumber"
  | "beneficiary"
  | "beneficiaryAddress"
  | "bic"
  | "bsbNumber"
  | "cedulaID"
  | "DNI"
  | "email"
  | "iban"
  | "lnurlAddress"
  | "name"
  | "nameTag"
  | "phone"
  | "pixAlias"
  | "postePayNumber"
  | "receiveAddress"
  | "reference"
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
