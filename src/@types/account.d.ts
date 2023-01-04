declare type Settings = {
  appVersion: string
  enableAnalytics?: boolean
  locale: string
  amount?: number
  returnAddress?: string
  payoutAddress?: string
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
  customFeeRate: number
  selectedFeeRate: FeeRate
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

declare type Account = Identity & {
  settings: Settings
  paymentData: PaymentData[]
  tradingLimit: TradingLimit
  offers: (SellOffer | BuyOffer)[]
  contracts: Contract[]
  chats: {
    [key: string]: Chat
  }
}
