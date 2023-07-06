export const PaymentDataInfoFields: PaymentDataField[] = [
  'accountNumber',
  'beneficiary',
  'bic',
  'email',
  'iban',
  'name',
  'phone',
  'reference',
  'ukBankAccount',
  'ukSortCode',
  'userName',
  'wallet',
  'receiveAddress',
]

export type PaymentDetailInfo = Partial<Record<PaymentDataField, Record<string, string>>>
