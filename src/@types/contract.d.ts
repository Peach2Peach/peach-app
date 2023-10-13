type ContractAction = 'none' | 'sendPayment' | 'confirmPayment'
type PaymentReminder = 'fourHours' | 'oneHour' | 'final'

type BatchInfo = {
  participants: number
  maxParticipants: number
  timeRemaining: number
  completed: boolean
  txId?: string
}

type Contract = {
  creationDate: Date
  id: string
  seller: User
  buyer: User

  symmetricKeyEncrypted: string
  symmetricKeySignature: string

  amount: number
  currency: Currency
  country?: PaymentMethodCountry
  buyerFee: number
  sellerFee: number

  price: number
  premium: number
  paymentMethod: PaymentMethod
  paymentDataEncrypted?: string
  paymentDataSignature?: string

  paymentMade: Date | null
  paymentConfirmed: Date | null
  paymentExpectedBy?: Date
  lastReminderSent?: PaymentReminder
  lastReminderDismissed?: PaymentReminder

  tradeStatus: TradeStatus
  lastModified: Date

  escrow: string
  releaseAddress: string
  releasePsbt: string
  batchReleasePsbt?: string
  batchInfo?: BatchInfo
  batchId?: string
  releaseTransaction: string
  releaseTxId?: string

  disputeActive: boolean
  disputeDate: Date | null
  disputeInitiator?: string
  disputeClaim?: string
  disputeReason?: DisputeReason
  disputeAcknowledgedByCounterParty?: boolean
  disputeWinner?: DisputeWinner
  disputeOutcome?: DisputeOutcome
  disputeResolvedDate?: Date | null
  isEmailRequired: boolean

  cancelationRequested: boolean
  canceled: boolean
  canceledBy?: 'buyer' | 'seller' | 'mediator'
  ratingBuyer: 1 | 0 | -1
  ratingSeller: 1 | 0 | -1

  messages: number
  unreadMessages: number
  isChatActive: boolean
}

type LocalContract = {
  id: string
  disputeResultAcknowledged?: boolean
  cancelConfirmationPending?: boolean
  cancelConfirmationDismissed?: boolean
  error?: 'DECRYPTION_ERROR'
  hasSeenDisputeEmailPopup?: boolean
}

type ContractViewer = 'buyer' | 'seller'
