
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
declare type FundingStatus = {
  status: 'NULL' | 'MEMPOOL' | 'FUNDED'
  confirmations?: number
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
  returnAddress: string,
  escrow?: string,
  funding?: FundingStatus
}

declare type PostOfferResponse = {
  offerId: number
}
declare type OfferType = 'ask' | 'bid'