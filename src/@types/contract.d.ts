

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

  releaseAddress: string,
  releaseTransaction: string,
  releaseTxId?: string,

  disputeActive: boolean,
  canceled: boolean,

  ratingBuyer: boolean,
  ratingSeller: boolean,

  messages: number
}