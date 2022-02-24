
declare type AccessToken = {
  expiry: number,
  accessToken: string
}

declare type APIError = {
  error: string
}

declare type User = {
  id: string,
  rating: number|null,
  ratingCount: number,
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
  txId?: string,
  amount
}
declare type PeachPairInfo = {
  pair: TradingPair,
  price: number,
}
declare type Offer = {
  id: string,
  online: boolean,
  userId: number, // TODO review why we have a userId of type number again?
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
  offerId: string
}
declare type OfferType = 'ask' | 'bid'

declare type CreateEscrowResponse = {
  offerId: string,
  escrow: string,
  funding: FundingStatus
}
declare type FundingError = '' | 'WRONG_FUNDING_AMOUNT'
declare type FundingStatusResponse = {
  offerId: string,
  escrow: string,
  funding: FundingStatus,
  error?: FundingError,
  returnAddress?: string
}

declare type Match = {
  user: User,
  offerId: string,
  prices: Pricebook,
  paymentMethods: PaymentMethod[],
  kyc: boolean,
  kycType?: KYCType,
}
declare type GetMatchesResponse = {
  offerId: string,
  matches: Match[],
}