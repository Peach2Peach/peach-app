/* eslint-disable max-lines */
declare type WSCallback = (message?: any) => void
declare type PeachWS = {
  ws?: WebSocket
  authenticated: boolean
  connected: boolean
  queue: (() => boolean)[]
  listeners: {
    message: WSCallback[]
    close: (() => void)[]
  }
  on: (listener: 'message' | 'close', callback: WSCallback) => void
  off: (listener: 'message' | 'close', callback: WSCallback) => void
  send: (data: string) => boolean
  close: WebSocket['close']
  onmessage?: WebSocket['onmessage'] | (() => {})
}

declare type ContractUpdate = {
  contractId: Contract['id']
  event: 'paymentMade' | 'paymentConfirmed'
  data: {
    date: number
  }
}

declare type AccessToken = {
  expiry: number
  accessToken: string
}

declare type APISuccess = {
  success: true
}

declare type APIError = {
  error: string
  details?: string | string[]
}

declare type User = {
  id: string
  creationDate: Date
  trades: number
  rating: number
  userRating: number
  ratingCount: number
  peachRating: number
  medals: Medal[]
  referralCode?: string
  usedReferralCode?: string
  bonusPoints: number
  referredTradingAmount: number
  disputes: {
    opened: number
    won: number
    lost: number
  }
  pgpPublicKey: string
  pgpPublicKeyProof: string
}

declare type TradingLimit = {
  daily: number
  dailyAmount: number
  yearly: number
  yearlyAmount: number
  monthlyAnonymous: number
  monthlyAnonymousAmount: number
}

declare type TradingPair = 'BTCEUR' | 'BTCCHF' | 'BTCGBP'

declare type Currency = 'USD' | 'EUR' | 'CHF' | 'GBP' | 'SEK'
declare type Pricebook = {
  [key in Currency]?: number
}
declare type Country = 'DE' | 'FR' | 'IT' | 'ES' | 'NL' | 'UK' | 'SE'
declare type Location = 'amsterdam' | 'belgianEmbassy' | 'lugano'
declare type PaymentMethod =
  | 'sepa'
  | 'paypal'
  | 'revolut'
  | 'applePay'
  | 'wise'
  | 'twint'
  | 'satispay'
  | 'swish'
  | 'mbWay'
  | 'bizum'
  | 'giftCard.amazon'
  | `giftCard.amazon.${Country}`
  | 'cash'
  | `cash.${Location}`

declare type PaymentMethodInfo = {
  id: PaymentMethod
  currencies: Currency[]
  countries?: Country[]
  rounded?: boolean
}

declare type KYCType = 'iban' | 'id'
declare type FundingStatus = {
  status: 'NULL' | 'MEMPOOL' | 'FUNDED' | 'WRONG_FUNDING_AMOUNT' | 'CANCELED'
  confirmations?: number
  txIds: string[]
  vouts: number[]
  amounts: number[]
  expiry: number
}

declare type GetStatusResponse = {
  error: null // TODO there will be error codes
  status: 'online' // TODO there will be other stati
  serverTime: number
}

declare type GetInfoResponse = {
  peach: {
    pgpPublicKey: string
  }
  fees: {
    escrow: number
  }
  minAmount: number
  maxAmount: number
  paymentMethods: PaymentMethodInfo[]
  latestAppVersion: string
  minAppVersion: string
}
declare type PeachInfo = GetInfoResponse

declare type GetTxResponse = Transaction
declare type PostTxResponse = {
  txId: string
}

declare type PeachPairInfo = {
  pair: TradingPair
  price: number
}
declare type MeansOfPayment = Partial<Record<Currency, PaymentMethod[]>>

declare type TradeStatus =
  | 'fundEscrow'
  | 'escrowWaitingForConfirmation'
  | 'fundingAmountDifferent'
  | 'messageSigningRequired'
  | 'searchingForPeer'
  | 'hasMatchesAvailable'
  | 'offerCanceled'
  | 'refundTxSignatureRequired'
  | 'paymentRequired'
  | 'confirmPaymentRequired'
  | 'dispute'
  | 'rateUser'
  | 'confirmCancelation'
  | 'tradeCompleted'
  | 'tradeCanceled'
  | 'waiting'

declare type OfferDraft = {
  creationDate: Date
  lastModified?: Date
  type: 'bid' | 'ask'
  meansOfPayment: MeansOfPayment
  paymentData: Partial<
    Record<
      PaymentMethod,
      {
        hash: string
        country?: Country
      }
    >
  >
  originalPaymentData: PaymentData[]
  kyc: boolean
  walletLabel?: string
  kycType?: KYCType
  walletLabel?: string
  tradeStatus?: TradeStatus
}
declare type Offer = OfferDraft & {
  id: string
  oldOfferId?: string
  newOfferId?: string
  publishingDate?: Date
  online: boolean
  user?: User
  publicKey?: string
  premium?: number
  prices?: Pricebook
  refunded?: boolean
  funding?: FundingStatus
  matches: Offer['id'][]
  doubleMatched: boolean
  contractId?: string
  tradeStatus: TradeStatus
}

declare type PostOfferResponse = {
  offerId: string
}
declare type OfferType = 'ask' | 'bid'

declare type CreateEscrowResponse = {
  offerId: string
  escrow: string
  funding: FundingStatus
}
declare type FundingError = '' | 'NOT_FOUND' | 'UNAUTHORIZED'
declare type FundingStatusResponse = {
  offerId: string
  escrow: string
  funding: FundingStatus
  error?: FundingError
  returnAddress: string
  userConfirmationRequired: boolean
}

declare type CancelOfferRequest = {
  satsPerByte?: number
}
declare type CancelOfferResponse = {
  psbt: string
  returnAddress: string
  amount: number
  fees: number
  satsPerByte: number
}

declare type MatchUnavailableReasons = {
  exceedsLimit: (keyof TradingLimit)[]
}

declare type Match = {
  user: User
  offerId: string
  amount: number
  escrow?: string
  prices: Pricebook
  matchedPrice: number | null
  premium: number
  meansOfPayment: MeansOfPayment
  paymentData: Offer['paymentData']
  selectedCurrency?: Currency
  selectedPaymentMethod?: PaymentMethod
  kyc: boolean
  kycType?: KYCType
  symmetricKeyEncrypted: string
  symmetricKeySignature: string
  matched: boolean
  unavailable: MatchUnavailableReasons
}
declare type GetMatchesResponse = {
  offerId: string
  matches: Match[]
  totalMatches: number
  remainingMatches: number
}
declare type MatchResponse = {
  success: true
  matchedPrice?: number
  contractId?: string
  refundTx?: string
}

declare type OfferSummary = {
  id: string
  type: 'bid' | 'ask'
  creationDate: Date
  lastModified: Date
  amount: number
  matches: string[]
  prices: Pricebook
  tradeStatus: TradeStatus
  contractId?: string
  txId?: string
}
declare type GetOffersResponse = (BuyOffer | SellOffer)[]
declare type GetOfferSummariesResponse = OfferSummary[]

declare type GetContractResponse = Contract

declare type ContractSummary = {
  id: string
  offerId: string
  type: 'bid' | 'ask'
  creationDate: Date
  lastModified: Date
  paymentMade?: Date
  tradeStatus: TradeStatus
  amount: number
  price: number
  currency: Currency
  disputeWinner?: Contract['disputeWinner']
  unreadMessages: number
  releaseTxId?: string
}
declare type GetContractsResponse = Contract[]
declare type GetContractSummariesResponse = ContractSummary[]

declare type ConfirmPaymentResponse = {
  success: true
  txId?: string
}

declare type GetChatResponse = Message[]

declare type PostChatProps = {
  contractId: Contract['id']
  message: string
  signature: string
}

declare type CancelContractResponse = {
  success: true
  psbt?: string
}

declare type FundEscrowResponse = {
  txId: string
}

declare type GenerateBlockResponse = {
  txId: string
}

declare type FeeRate = 'fastestFee' | 'halfHourFee' | 'hourFee' | 'economyFee' | 'custom'

declare type FeeRecommendation = {
  fastestFee: number
  halfHourFee: number
  hourFee: number
  economyFee: number
  minimumFee: number
}
declare type GetFeeEstimateResponse = FeeRecommendation
declare type TradeSummary = (OfferSummary | ContractSummary) & {
  paymentMade?: Date
}
