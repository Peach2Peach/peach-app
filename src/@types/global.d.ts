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
}

declare type SellOffer = Offer & {
  type: 'ask',
  premium: number,
  paymentData: PaymentData[],
  hashedPaymentData: string,
  kycType?: KYCType,
  returnAddress?: string,
  depositAddress?: string,
  escrow?: string,
  funding?: FundingStatus,
}

declare type BuyOffer = Offer & {
  type: 'bid'
  paymentData: PaymentData[],
  releaseAddress?: string,
}

declare type PeachWallet = {
  wallet: bitcoin.bip32.BIP32Interface,
  mnemonic: string
}