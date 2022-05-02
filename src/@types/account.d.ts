declare type Settings = {
  skipTutorial?: boolean,
  amount?: number,
  currencies?: Currency[],
  paymentMethods?: PaymentMethod[],
  premium?: number,
  kyc?: boolean,
  kycType?: KYCType,
  pgpPublished?: boolean,
}

declare type PGPKeychain = {
  privateKey: string,
  publicKey: string,
}

declare type Account = {
  publicKey: string,
  privKey?: string,
  mnemonic?: string,
  pgp: PGPKeychain,
  settings: Settings,
  paymentData: PaymentData[],
  offers: (SellOffer|BuyOffer)[],
  contracts: Contract[],
  chats: {
    [key: string]: Chat
  }
}