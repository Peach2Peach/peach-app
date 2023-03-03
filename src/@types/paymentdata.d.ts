declare type PaymentData = {
  [key: string]: any
  id: string
  version?: string
  label: string
  type: PaymentMethod
  currencies: Currency[]
  country?: PaymentMethodCountry
  hidden?: boolean
  reference?: string
}

declare type PaypalData = {
  phone: string
  email: string
  userName: string
}
declare type SEPAData = {
  beneficiary: string
  iban: string
  bic?: string
}
declare type FasterPaymentsData = {
  beneficiary: string
  ukBankAccount: string
  ukSortCode: string
}
declare type BizumData = {
  phone: string
  beneficiary: string
}
declare type MobilePayData = {
  phone: string
  beneficiary: string
}
declare type MBWayData = {
  phone: string
  beneficiary: string
}
declare type RevolutData = {
  phone: string
  userName: string
  email: string
}
declare type VippsData = {
  phone: string
  beneficiary?: string
}
declare type ADVCashData = {
  wallet: string
  email: string
}
declare type SwishData = {
  phone: string
  beneficiary: string
}
declare type SatispayData = {
  beneficiary?: string
  phone: string
}
declare type BlikData = {
  beneficiary?: string
  phone: string
}
declare type TwintData = {
  phone: string
  beneficiary: string
}
declare type WiseData = {
  email: string
  phone: string
}
declare type AmazonGiftCardData = {
  email: string
}
declare type CashData = {
  userId: string
}
declare type NationaTransferData = {
  beneficiary: string
  iban?: string
  accountNumber?: string
  bic: string
}
