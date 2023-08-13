declare type RootStackParamList = {
  home: undefined
  newUser: {
    referralCode?: string
  }
  restoreBackup: { tab: 'fileBackup' | 'seedPhrase' } | undefined
  restoreReputation: {
    referralCode?: string
  }
  newBadge: {
    badges: string
  }
  wallet: undefined
  sendBitcoin: undefined
  receiveBitcoin: undefined
  transactionHistory: undefined
  transactionDetails: {
    txId: string
  }
  bumpNetworkFees: {
    txId: string
  }
  buy: undefined
  sell: undefined
  buyPreferences: undefined
  premium: undefined
  sellPreferences: undefined
  buySummary: undefined
  sellSummary: undefined
  selectCurrency: {
    origin: keyof RootStackParamList
  }
  selectPaymentMethod: {
    selectedCurrency: Currency
    origin: keyof RootStackParamList
  }
  selectCountry: {
    selectedCurrency: Currency
    origin: keyof RootStackParamList
  }
  paymentMethodForm: {
    paymentData: Partial<PaymentData> & {
      type: PaymentMethod
      currencies: Currency[]
    }
    origin: keyof RootStackParamList
  }
  signMessage: undefined
  fundEscrow: {
    offerId: string
  }
  wrongFundingAmount: {
    offerId: string
  }
  selectWallet: {
    type: 'refund' | 'payout'
  }
  setRefundWallet: {
    offerId: string
  }
  offerPublished: {
    offerId: string
    isSellOffer: boolean
    shouldGoBack?: boolean
  }
  search: { offerId: string }
  editPremium: { offerId: string }
  contract: {
    contractId: Contract['id']
    contract?: Contract
  }
  contractChat: {
    contractId: Contract['id']
  }
  paymentMade: {
    contractId: Contract['id']
  }
  disputeReasonSelector: {
    contractId: Contract['id']
  }
  disputeForm: {
    contractId: Contract['id']
    reason: DisputeReason
  }
  tradeComplete: {
    contract: Contract
  }
  yourTrades:
    | {
        tab?: TradeTab
      }
    | undefined
  offer: {
    offerId: string
  }
  settings: undefined
  contact: undefined
  report: {
    reason: ContactReason
    topic?: string
    message?: string
    shareDeviceID?: boolean
  }
  language: undefined
  currency: undefined
  publicProfile: undefined
  referrals: undefined
  backupTime: {
    nextScreen?: keyof RootStackParamList
    [key: string]: any
  }
  backups: undefined
  backupCreated: undefined
  seedWords: undefined
  payoutAddress:
    | {
        type: 'refund' | 'payout'
      }
    | undefined
  paymentMethods: undefined
  meetupScreen: {
    eventId: string
    deletable?: boolean
    origin: keyof RootStackParamList
  }
  deleteAccount: undefined
  peachFees: undefined
  networkFees: undefined
  aboutPeach: undefined
  bitcoinProducts: undefined
  socials: undefined
  welcome: {
    referralCode?: string
  }
  splashScreen: undefined
  myProfile: undefined
} & Record<`testView${string}`, undefined>

type KeysWithUndefined<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never
}[keyof T]

declare type ScreenWithoutProps = KeysWithUndefined<RootStackParamList>
