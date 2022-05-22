declare type Settings = {
  appVersion: string,
  skipTutorial?: boolean,
  locale: string,
  amount?: number,
  displayCurrency: Currency,
  meansOfPayment: MeansOfPayment,
  preferredPaymentMethods: Partial<Record<PaymentMethod, PaymentData['id']>>,
  premium?: number,
  kyc?: boolean,
  kycType?: KYCType,
  pgpPublished?: boolean,
  fcmTokenPublished?: boolean,
  lastBackupDate?: number
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
  tradingLimit: TradingLimit,
  offers: (SellOffer|BuyOffer)[],
  contracts: Contract[],
  chats: {
    [key: string]: Chat
  }
}