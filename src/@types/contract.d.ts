

declare type ContractAction = 'none' | 'kycResponse' | 'makePayment' | 'confirmPayment'

declare type DisputeReason = 'wrongPaymentAmount' | 'noPayment' | 'buyerUnresponsive' | 'buyerBehaviour'
  | 'satsNotReceived' | 'sellerUnresponsive' | 'sellerBehaviour'
  | 'disputeOther'

declare type Contract = {
  creationDate: Date,
  id: string,
  seller: User,
  buyer: User,

  symmetricKeyEncrypted: string,
  symmetricKey?: string,
  symmetricKeySignature: string,

  amount: number,
  currency: Currency,
  price: number,
  premium: number,
  paymentMethod: PaymentMethod,
  paymentDataEncrypted?: string,
  paymentData?: PaymentData,
  paymentDataSignature?: string,

  kycRequired: boolean,
  kycType?: KYCType,

  kycConfirmed: boolean,
  kycResponseDate?: Date|null,
  paymentMade: Date|null,
  paymentConfirmed: Date|null,

  escrow: string,
  releaseAddress: string,
  releaseTransaction: string,
  releaseTxId?: string,

  disputeActive: boolean,
  disputeDate: Date|null,
  disputeInitiator?: string,
  disputeClaim?: string,
  disputeReason?: DisputeReason,
  disputeAcknowledgedByCounterParty?: boolean,
  disputeResultAcknowledged?: boolean,
  disputeWinner?: 'seller' | 'buyer',
  disputeResolvedDate?: Date|null,

  canceled: boolean,

  ratingBuyer: 1|0|-1,
  ratingSeller: 1|0|-1,

  messages: number
}