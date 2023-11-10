type Settings = {
  appVersion: string
  analyticsPopupSeen?: boolean
  enableAnalytics?: boolean
  locale?: string
  returnAddress?: string
  payoutAddress?: string
  payoutAddressLabel?: string
  payoutAddressSignature?: string
  derivationPath?: string
  displayCurrency: Currency
  country?: string
  pgpPublished?: boolean
  fcmToken?: string
  lastFileBackupDate?: number
  lastSeedBackupDate?: number
  showBackupReminder: boolean
  shouldShowBackupOverlay: boolean
  peachWalletActive: boolean
  nodeURL: string
  feeRate: FeeRate
  usedReferralCode?: boolean
  cloudflareChallenge?: {
    cfClearance: string
    userAgent: string
  }
}

type PGPKeychain = {
  privateKey: string
  publicKey: string
}

type Identity = {
  publicKey: string
  privKey?: string
  mnemonic?: string
  base58?: string
  pgp: PGPKeychain
}

type Account = Identity & {
  tradingLimit: TradingLimit
  offers: (SellOffer | BuyOffer)[]
  chats: {
    [key: string]: Chat
  }
}

type AccountBackup = Account & {
  paymentData: PaymentData[]
  settings: Settings
}
