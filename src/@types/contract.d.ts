

declare type ContractAction = 'none' | 'kycResponse' | 'paymentMade' | 'paymentConfirmed'

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

  contractErrors?: string[],

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
  disputeAcknowledgedByCounterParty?: boolean,

  canceled: boolean,

  ratingBuyer: 1|0|-1,
  ratingSeller: 1|0|-1,

  messages: number
}