declare type ContractAction = 'none' | 'kycResponse' | 'sendPayment' | 'confirmPayment'

declare type DisputeReason =
  | 'noPayment.buyer'
  | 'noPayment.seller'
  | 'unresponsive.buyer'
  | 'unresponsive.seller'
  | 'abusive'
  | 'other'

declare type PaymentReminder = 'fourHours' | 'oneHour' | 'final'

declare type Contract = {
  creationDate: Date
  id: string
  seller: User
  buyer: User

  symmetricKeyEncrypted: string
  symmetricKey?: string
  symmetricKeySignature: string

  amount: number
  currency: Currency
  country?: PaymentMethodCountry

  price: number
  premium: number
  paymentMethod: PaymentMethod
  paymentDataEncrypted?: string
  paymentData?: PaymentData
  paymentDataSignature?: string
  error?: 'DECRYPTION_ERROR'

  kycRequired: boolean
  kycType?: KYCType

  kycConfirmed: boolean
  kycResponseDate?: Date | null
  paymentMade: Date | null
  paymentConfirmed: Date | null
  paymentExpectedBy?: Date
  lastReminderSent?: PaymentReminder
  lastReminderDismissed?: PaymentReminder

  tradeStatus: TradeStatus
  lastModified: Date

  escrow: string
  releaseAddress: string
  releaseTransaction: string
  releaseTxId?: string

  disputeActive: boolean
  disputeDate: Date | null
  disputeInitiator?: string
  disputeClaim?: string
  disputeReason?: DisputeReason
  disputeAcknowledgedByCounterParty?: boolean
  disputeWinner?: 'seller' | 'buyer'
  disputeResolvedDate?: Date | null

  cancelationRequested: boolean
  canceled: boolean
  canceledBy?: 'buyer' | 'seller' | 'mediator'
  ratingBuyer: 1 | 0 | -1
  ratingSeller: 1 | 0 | -1

  messages: number
  unreadMessages: number

  // app specific
  disputeResultAcknowledged?: boolean
  cancelConfirmationPending?: boolean
  cancelConfirmationDismissed?: boolean
}

declare type ContractViewer = 'buyer' | 'seller'
