type PaymentDataInfo = {
  accountNumber?: string
  beneficiary?: string
  bic?: string
  email?: string
  iban?: string
  name?: string
  phone?: string
  reference?: string
  ukBankAccount?: string
  ukSortCode?: string
  userName?: string
  wallet?: string
  receiveAddress?: string
  lnurlAddress?: string
  userId?: string
  cbu?: string
  cvu?: string
  cvuAlias?: string
  chipperTag?: string
  eversendUserName?: string
  pixAlias?: string
  postePayNumber?: string
}

type PaymentDataField = keyof PaymentDataInfo

type PaymentData = PaymentDataInfo & {
  id: string
  label: string
  type: PaymentMethod
  currencies: Currency[]
  country?: PaymentMethodCountry
  hidden?: boolean
  reference?: string
}
