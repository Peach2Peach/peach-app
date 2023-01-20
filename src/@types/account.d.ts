declare type Settings = {
  appVersion: string
  enableAnalytics?: boolean
  locale: string
  minAmount: number
  maxAmount: number
  returnAddress?: string
  payoutAddress?: string
  payoutAddressLabel?: string
  derivationPath?: string
  displayCurrency: Currency
  country?: string
  meansOfPayment: MeansOfPayment
  preferredPaymentMethods: Partial<Record<PaymentMethod, PaymentData['id']>>
  premium?: number
  kyc?: boolean
  kycType?: KYCType
  pgpPublished?: boolean
  fcmToken?: string
  lastBackupDate?: number
  lastSeedBackupDate?: number
  showBackupReminder: boolean
  showDisputeDisclaimer: boolean
  peachWalletActive: boolean
  nodeURL: string
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
