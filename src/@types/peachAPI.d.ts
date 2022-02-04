
declare type AccessToken = {
  expiry: number,
  accessToken: string
}

declare type APIError = {
  error: string
}

declare type TradingPair = 'BTCEUR' | 'BTCCHF' | 'BTCGBP'

declare type Buckets = {
  [key: string]: number
}
declare type Currency = 'EUR' | 'CHF' | 'GBP'
declare type Pricebook = {
  [key in Currency]: number
}
declare type PaymentMethod = 'sepa'
declare type KYCType = 'iban' | 'id'
declare type FundingStatus = {
  status: 'NULL' | 'MEMPOOL' | 'FUNDED'
  confirmations?: number,
  amount
}
declare type PeachPairInfo = {
  pair: TradingPair,
  price: number,
}
declare type Offer = {
  offerId: number,
  userId: number,
  publicKey: string,
  type: 'bid' | 'ask',
  amount: number,
  premium: number,
  currencies: string|string[],
  prices?: Pricebook,
  paymentMethods: string|string[],
  kyc: boolean,
  kycType: KYCType,
  returnAddress: string,
  escrow?: string,
  funding?: FundingStatus
}

declare type PostOfferResponse = {
  offerId: number
}
declare type OfferType = 'ask' | 'bid'

declare type CreateEscrowResponse = {
  offerId: number,
  escrow: string,
  funding: FundingStatus
}
declare type FundingStatusResponse = {
  offerId: number,
  escrow: string,
  funding: FundingStatus,
  error?: 'WRONG_FUNDING_AMOUNT',
}