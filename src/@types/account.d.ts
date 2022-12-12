declare type Settings = {
  appVersion: string
  enableAnalytics?: boolean
  locale: string
  amount?: number
  returnAddress?: string
  derivationPath?: string
  hdStartIndex?: number
  displayCurrency: Currency
  country?: string
  meansOfPayment: MeansOfPayment
  preferredPaymentMethods: Partial<Record<PaymentMethod, PaymentData['id']>>
  preferredCurrencies: Currency[]
  premium?: number
  kyc?: boolean
  kycType?: KYCType
  pgpPublished?: boolean
  fcmToken?: string
  lastBackupDate?: number
  showBackupReminder: boolean
  showDisputeDisclaimer: boolean
}

declare type PGPKeychain = {
  privateKey: string
  publicKey: string
}

declare type Identity = {
  publicKey: string
  privKey?: string
  mnemonic?: string
  pgp: PGPKeychain
}

declare type Chats = Record<Chat['id'], Chat>

declare type Account = Identity & {
  settings: Settings
  paymentData: PaymentData[]
  tradingLimit: TradingLimit
  offers: (SellOffer | BuyOffer)[]
  contracts: Contract[]
  chats: Chats
}
