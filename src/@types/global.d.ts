declare type PaymentData = {
  id: string,
  type: PaymentMethod,
  selected?: boolean,
  [key: string]: string
}

// TODO consider hashing payment methods to have proof that payment method did not change at later point
declare type SellOffer = {
  offerId?: number,
  type: 'ask',
  amount: number,
  premium: number,
  currencies: Currency[],
  paymentData: PaymentData[],
  kyc: boolean;
  kycType?: KYCType;
  returnAddress?: string;
}

declare type PeachWallet = {
  wallet: bitcoin.bip32.BIP32Interface,
  mnemonic: string
}