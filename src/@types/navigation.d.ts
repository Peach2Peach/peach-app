type RootStackParamList = {
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
  nodeSetup: undefined
  sendBitcoin: undefined
  receiveBitcoin: undefined
  addressChecker: undefined
  coinSelection: undefined
  transactionHistory: undefined
  exportTransactionHistory: undefined
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
    contractId: Contract['id']
  }
  yourTrades:
    | {
        tab?: TradeTab
      }
    | undefined
  exportTradeHistory: undefined
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
  publicProfile: {
    userId: string
  }
  referrals: undefined
  backupTime: {
    nextScreen?: keyof RootStackParamList
    [key: string]: unknown
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
  welcome:
    | {
        referralCode?: string
      }
    | undefined
  myProfile: undefined
  transactionBatching: undefined
  groupHugAnnouncement: {
    offerId: string
  }
  testView: undefined
  testViewPeachWallet: undefined
  testViewPNs: undefined
}
