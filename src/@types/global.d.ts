declare type MessageState = {
  msg: string,
  level: Level,
  time?: number,
}
declare type OverlayState = {
  overlayContent: ReactNode,
}
declare type BitcoinContextType = {
  currency: Currency,
  price: number,
  satsPerUnit: number
}

declare type Session = {
  initialized: boolean
  password?: string
}

declare type PaymentData = {
  id: string,
  type: PaymentMethod,
  selected?: boolean,
  [key: string]: string,
}

declare type Offer = {
  id?: string,
  published: boolean,
  amount: number,
  currencies: Currency[],
  kyc: boolean,
  matches: string[],
  doubleMatched: boolean,
  contractId?: string,
}

declare type SellOffer = Offer & {
  type: 'ask',
  premium: number,
  paymentData: PaymentData[],
  hashedPaymentData: string,
  kycType?: KYCType,
  depositAddress?: string,
  returnAddress?: string,
  confirmedReturnAddress?: boolean,
  escrow?: string,
  funding?: FundingStatus,
}

declare type BuyOffer = Offer & {
  type: 'bid'
  paymentData: PaymentData[],
  releaseAddress?: string,
}

declare type Contract = {
  creationDate: Date,
  id: string,
  sellerId: string,
  buyerId: string,

  currency: Currency,
  price: number,
  paymentMethod: PaymentMethod,

  kycRequired: boolean,
  kycType: KYCType,
  releaseAddress: string,

  kycConfirmed: boolean,
  kycResponseDate: Date,
  paymentMade: boolean,
  paymentConfirmed: Date,

  disputeActive: boolean
}

declare type PeachWallet = {
  wallet: bitcoin.bip32.BIP32Interface,
  mnemonic: string
}