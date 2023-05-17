declare type PaymentData = {
  [key: string]: any
  name: string
  beneficiary: string
  phone: string
  userName: string
  email: string
  accountNumber: string
  iban: string
  bic: string
  reference: string
  wallet: string
  ukBankAccount: string
  ukSortCode: string
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
  phone?: string
  email?: string
  userName?: string
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
  phone?: string
  userName?: string
  email?: string
}
declare type WiseData = {
  phone: string
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
declare type NationalTransferData = {
  beneficiary: string
  iban?: string
  accountNumber?: string
  bic?: string
}
declare type SkrillData = {
  email: string
  beneficiary?: string
}
declare type NetellerData = {
  email: string
  beneficiary?: string
}
declare type PayseraData = {
  phone: string
  beneficiary?: string
}
declare type StraksbetalingData = {
  beneficiary: string
  accountNumber: string
}
declare type KEKSPayData = {
  beneficiary?: string
  phone: string
}
declare type Friends24Data = {
  beneficiary?: string
  phone: string
}
declare type N26Data = {
  beneficiary?: string
  phone: string
}
declare type PaylibData = {
  beneficiary?: string
  phone: string
}
declare type LydiaData = {
  beneficiary?: string
  phone: string
}
declare type VerseData = {
  beneficiary?: string
  phone: string
}
declare type IrisData = {
  beneficiary?: string
  phone: string
}
