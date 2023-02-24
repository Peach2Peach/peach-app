declare type PaymentData = {
  [key: string]: any
  id: string
  version?: string
  label: string
  type: PaymentMethod
  currencies: Currency[]
  country?: PaymentMethodCountry
  hidden?: boolean
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
  reference?: string
}
declare type BizumData = {
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
declare type SwishData = {
  phone: string
  beneficiary: string
}
declare type SatispayData = {
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
