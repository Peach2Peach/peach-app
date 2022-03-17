declare type AnyObject = {
  [key: string]: any
}

declare type Settings = {
  skipTutorial?: boolean,
  amount?: number,
  currencies?: Currency[],
  paymentMethods?: PaymentMethod[],
  premium?: number,
  kyc?: boolean,
  kycType?: KYCType,
}

declare type PGPKeychain = {
  privateKey: string,
  publicKey: string,
}

declare type Account = {
  publicKey?: string,
  privKey?: string,
  mnemonic?: string,
  pgp: PGPKeychain,
  settings: Settings,
  paymentData: PaymentData[],
  offers: (SellOffer|BuyOffer)[],
  contracts: Contract[],
}

declare type Rating = {
  rating: -1 | 1,
  signature: string,
  ratedBy: User.id,
}
declare type User = {
  id: string,
  creationDate: Date,
  rating: number|null,
  ratingCount: number,
  pgpPublicKey: string,
  pgpPublicKeyProof: string,
}

declare type MessageState = {
  msg: string,
  level: Level,
  time?: number,
}
declare type OverlayState = {
  content: ReactNode,
  showCloseButton: boolean,
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
  [key: string]: any,
  id: string,
  type: PaymentMethod,
  selected?: boolean,
}

declare type Offer = {
  id?: string,
  creationDate: Date,
  online?: boolean,
  user?: User,
  published: boolean,
  amount: number,
  currencies: Currency[],
  paymentMethods: PaymentMethod[],
  kyc: boolean,
  matches: string[],
  doubleMatched: boolean,
  contractId?: string,
}

declare type SellOffer = Offer & {
  type: 'ask',
  premium: number,
  paymentData: PaymentData[],
  kycType?: KYCType,
  depositAddress?: string,
  returnAddress?: string,
  confirmedReturnAddress?: boolean,
  escrow?: string,
  funding?: FundingStatus,
  tx?: string,
  txId?: string,
  refunded: boolean,
  released: boolean,
}

declare type BuyOffer = Offer & {
  type: 'bid'
  releaseAddress?: string,
}

declare type ContractAction = 'none' | 'kycResponse' | 'paymentMade' | 'paymentConfirmed'

declare type Contract = {
  creationDate: Date,
  id: string,
  seller: User,
  buyer: User,

  amount: number,
  currency: Currency,
  price: number,
  paymentMethod: PaymentMethod,
  paymentDataEncrypted?: string,
  paymentData?: PaymentData,
  paymentDataSignature?: string,

  kycRequired: boolean,
  kycType?: KYCType,

  kycConfirmed?: boolean,
  kycResponseDate?: Date|null,
  paymentMade: Date|null,
  paymentConfirmed: Date|null,

  releaseAddress: string,
  releaseTransaction: string,
  releaseTxId: string,

  ratingBuyer: Rating,
  ratingSeller: Rating,

  disputeActive: boolean,
  canceled: boolean,
}

declare type PeachWallet = {
  wallet: bitcoin.bip32.BIP32Interface,
  mnemonic: string
}