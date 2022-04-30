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
  error: string
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
  pgpPublicKey: string
  pgpPublicKeyProof: string
}

declare type TradingPair = 'BTCEUR' | 'BTCCHF' | 'BTCGBP'

declare type Buckets = {
  [key: string]: number
}
declare type Currency = 'EUR' | 'CHF' | 'GBP'
declare type Pricebook = {
  [key in Currency]?: number
}
declare type PaymentMethod = 'iban' | 'paypal' | 'giftCard' | 'revolut' | 'applePay' | 'twint' | 'wise'
declare type PaymentMethodInfo = {
  id: PaymentMethod,
  currencies: Currency[],
  exchange: boolean,
}

declare type KYCType = 'iban' | 'id'
declare type FundingStatus = {
  status: 'NULL' | 'MEMPOOL' | 'FUNDED' | 'WRONG_FUNDING_AMOUNT' | 'CANCELED'
  confirmations?: number,
  txId?: string,
  amount: number
}

declare type GetStatusResponse = {
  error: null, // TODO there will be error codes,
  status: 'online', // TODO there will be other stati
  date: string,
}

declare type GetInfoResponse = {
  fees: {
    escrow: number,
  },
  buckets: number[],
  paymentMethods: PaymentMethodInfo[],
  minAppVersion: string,
}

declare type GetTxResponse = Transaction
declare type PostTxResponse = {
  txId: string,
}

declare type PeachPairInfo = {
  pair: TradingPair,
  price: number,
}
declare type Offer = {
  id: string,
  creationDate: Date,
  online: boolean,
  user?: User,
  publicKey: string,
  type: 'bid' | 'ask',
  amount: number,
  premium: number,
  currencies: Currency[],
  prices?: Pricebook,
  paymentMethods: PaymentMethod[],
  kyc: boolean,
  kycType: KYCType,
  returnAddress: string,
  escrow?: string,
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
declare type CancelOfferResponse = {
  psbt: string,
  returnAddress: string,
  amount: number,
  fees: number,
  returnAddress: string,
  inputIndex: number,
}

declare type Match = {
  user: User,
  offerId: string,
  prices: Pricebook,
  matchedPrice: number | null,
  premium: number,
  selectedCurrency: Currency | null,
  paymentMethods: PaymentMethod[],
  selectedPaymentMethod: PaymentMethod | null,
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