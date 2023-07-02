declare type PaymentData = {
  [key: string]: any
  paymentMethod: PaymentMethod
  name?: string
  beneficiary?: string
  phone?: string
  userName?: string
  email?: string
  accountNumber?: string
  iban?: string
  bic?: string
  reference?: string
  wallet?: string
  ukBankAccount?: string
  ukSortCode?: string
  id: string
  version?: string
  label: string
  type: PaymentMethod
  currencies: Currency[]
  country?: PaymentMethodCountry
  hidden?: boolean
  reference?: string
}
