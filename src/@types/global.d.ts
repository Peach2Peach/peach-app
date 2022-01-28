declare type Session = {
  initialized: boolean
  password?: string
}

declare type PaymentData = {
  id: string,
  type: PaymentMethod,
  selected?: boolean,
  [key: string]: string
}

declare type SellOffer = {
  offerId?: number,
  type: 'ask',
  amount: number,
  premium: number,
  currencies: Currency[],
  paymentData: PaymentData[],
  hashedPaymentData: string,
  kyc: boolean;
  kycType?: KYCType;
  returnAddress?: string;
  escrow?: string,
  funding?: FundingStatus
}

declare type PeachWallet = {
  wallet: bitcoin.bip32.BIP32Interface,
  mnemonic: string
}