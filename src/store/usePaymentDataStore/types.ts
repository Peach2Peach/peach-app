export const PaymentDataInfoFields: PaymentDataField[] = [
  'wallet',
  'phone',
  'email',
  'userName',
  'beneficiary',
  'iban',
  'accountNumber',
  'bic',
  'name',
  'ukBankAccount',
  'ukSortCode',
  'receiveAddress',
  'reference',
]

export type PaymentDetailInfo = Partial<Record<PaymentDataField, Record<string, string>>>
