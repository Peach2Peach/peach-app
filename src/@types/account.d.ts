declare type Settings = {
  appVersion: string
  analyticsPopupSeen?: boolean
  enableAnalytics?: boolean
  locale: string
  minBuyAmount: number
  maxBuyAmount: number
  sellAmount: number
  returnAddress?: string
  payoutAddress?: string
  payoutAddressLabel?: string
  payoutAddressSignature?: string
  derivationPath?: string
  displayCurrency: Currency
  country?: string
  meansOfPayment: MeansOfPayment
  preferredPaymentMethods: Partial<Record<PaymentMethod, PaymentData['id']>>
  premium: number
  pgpPublished?: boolean
  fcmToken?: string
  lastFileBackupDate?: number
  lastSeedBackupDate?: number
  showBackupReminder: boolean
  peachWalletActive: boolean
  nodeURL: string
  feeRate: number | 'fastestFee' | 'halfHourFee' | 'hourFee' | 'economyFee'
  usedReferralCode?: boolean
  lastBackupDate?: number
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
  paymentData: PaymentData[]
  legacyPaymentData: PaymentData[]
  tradingLimit: TradingLimit
  offers: (SellOffer | BuyOffer)[]
  contracts: Contract[]
  chats: {
    [key: string]: Chat
  }
}

declare type AccountBackup = Account & {
  settings: Settings
}
