declare type Settings = {
  appVersion: string,
  skipTutorial?: boolean,
  enableAnalytics?: boolean,
  locale: string,
  amount?: number,
  returnAddress?: string,
  derivationPath?: string,
  hdStartIndex?: number,
  displayCurrency: Currency,
  country?: string,
  meansOfPayment: MeansOfPayment,
  preferredPaymentMethods: Partial<Record<PaymentMethod, PaymentData['id']>>,
  preferredCurrencies: Currency[],
  premium?: number,
  kyc?: boolean,
  kycType?: KYCType,
  pgpPublished?: boolean,
  fcmToken?: string,
  lastBackupDate?: number,
  showBackupReminder: boolean
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