declare type WSCallback = (message?: any) => void
declare type PeachWS = {
  ws?: WebSocket,
  authenticated: boolean,
  connected: boolean,
  queue: (() => boolean)[],
  listeners: {
    message: WSCallback[]
    close: (() => void)[]
  },
  on: (listener: 'message'|'close', callback: WSCallback) => void,
  off: (listener: 'message'|'close', callback: WSCallback) => void,
  send: (data: string) => boolean,
  close: WebSocket['close'],
  onmessage?: WebSocket['onmessage']|(() => {}),
}

declare type AccessToken = {
  expiry: number,
  accessToken: string
}

declare type APISuccess = {
  success: true
}

declare type APIError = {
  error: string,
  details?: unknown
}

declare type User = {
  id: string,
  creationDate: Date,
  trades: number,
  rating: number,
  userRating: number,
  ratingCount: number,
  peachRating: number,
  medals: Medal[],
  disputes: {
    opened: number,
    won: number,
    lost: number,
  },
  pgpPublicKey: string
  pgpPublicKeyProof: string
}

declare type TradingLimit = {
  daily: number,
  dailyAmount: number,
  yearly: number,
  yearlyAmount: number,
}

declare type TradingPair = 'BTCEUR' | 'BTCCHF' | 'BTCGBP'

declare type Buckets = {
  [key: string]: number
}
declare type Currency = 'USD' | 'EUR' | 'CHF' | 'GBP' | 'SEK'
declare type Pricebook = {
  [key in Currency]?: number
}
declare type PaymentMethod =
  'sepa' | 'swift' | 'bankTransferCH' | 'bankTransferUK'
  | 'paypal' | 'revolut' | 'applePay' | 'wise' | 'twint' | 'swish' | 'mbWay' | 'bizum'
  | 'tether'

declare type PaymentMethodInfo = {
  id: PaymentMethod,
  currencies: Currency[],
  exchange: boolean,
}

declare type KYCType = 'iban' | 'id'
declare type FundingStatus = {
  status: 'NULL' | 'MEMPOOL' | 'FUNDED' | 'WRONG_FUNDING_AMOUNT' | 'CANCELED'
  confirmations?: number,
  txIds: string[],
  vouts: number[],
  amounts: number[],
  amount?: number // TODO remove for release 0.1.0
}

declare type GetStatusResponse = {
  error: null, // TODO there will be error codes,
  status: 'online', // TODO there will be other stati
  date: string,
}

declare type GetInfoResponse = {
  peach: {
    pgpPublicKey: string,
  },
  fees: {
    escrow: number,
  },
  buckets: number[],
  deprecatedBuckets: number[],
  paymentMethods: PaymentMethodInfo[],
  minAppVersion: string,
}
declare type PeachInfo = GetInfoResponse

declare type GetTxResponse = Transaction
declare type PostTxResponse = {
  txId: string,
}

declare type PeachPairInfo = {
  pair: TradingPair,
  price: number,
}
declare type MeansOfPayment = Partial<Record<Currency, PaymentMethod[]>>

declare type Offer = {
  id: string,
  creationDate: Date,
  online: boolean,
  user?: User,
  publicKey?: string,
  type: 'bid' | 'ask',
  amount: number,
  premium?: number,
  prices?: Pricebook,
  meansOfPayment: MeansOfPayment,
  kyc: boolean,
  kycType?: KYCType,
  returnAddress?: string,
  escrow?: string,
  refunded?: boolean,
  funding?: FundingStatus,
  matches: Offer['id'][],
  doubleMatched: boolean,
  contractId?: string
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
declare type FundingError = '' | 'NOT_FOUND'| 'UNAUTHORIZED'
declare type FundingStatusResponse = {
  offerId: string,
  escrow: string,
  funding: FundingStatus,
  error?: FundingError,
  returnAddress: string
}

declare type CancelOfferRequest = {
  satsPerByte?: number
}
declare type CancelOfferResponse = {
  psbt: string,
  returnAddress: string,
  amount: number,
  fees: number,
  satsPerByte: number,
}

declare type Match = {
  user: User,
  offerId: string,
  prices: Pricebook,
  matchedPrice: number | null,
  premium: number,
  meansOfPayment: MeansOfPayment,
  selectedCurrency?: Currency,
  selectedPaymentMethod?: PaymentMethod,
  kyc: boolean,
  kycType?: KYCType,
  symmetricKeyEncrypted: string,
  symmetricKeySignature: string,
  matched: boolean
}
declare type GetMatchesResponse = {
  offerId: string,
  matches: Match[],
}
declare type MatchResponse = {
  success: true,
  matchedPrice?: number,
  contractId?: string,
}
declare type GetContractResponse = Contract
declare type GetContractsResponse = Contract[]
declare type ConfirmPaymentResponse = {
  success: true,
  txId?: string,
}

declare type GetChatResponse = Message[]