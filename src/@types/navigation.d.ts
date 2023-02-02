declare type RootStackParamList = {
  home: undefined
  newUser: {
    referralCode?: string
  }
  restoreBackup: undefined
  wallet: undefined
  transactionHistory: undefined
  transactionDetails: {
    txId: string
  }
  buy: undefined
  sell: undefined
  buyPreferences: { amount: [number, number] }
  sellPreferences: { amount: number }
  addPaymentMethod: {
    currencies?: Currency[]
    country?: Country
    paymentMethod?: PaymentMethod
    origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]
  }
  paymentDetails: {
    paymentData: Partial<PaymentData> & {
      type: PaymentMethod
      currencies: Currency[]
    }
    origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]
    originOnCancel?: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]
  }
  signMessage: {
    offerId: string
  }
  fundEscrow: {
    offer: SellOffer
  }
  selectWallet: {
    type: 'refund' | 'payout'
  }
  offerPublished: { offerId: string }
  search: { offerId: string }
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
  yourTrades: undefined
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
    view: 'buyer' | 'seller'
    nextScreen?: keyof RootStackParamList
    [key: string]: any
  }
  backups: undefined
  backupCreated: undefined
  seedWords: undefined
  payoutAddress: undefined
  walletSettings: undefined
  paymentMethods: undefined
  meetupScreen: {
    eventId: string
    deletable?: boolean
    origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]
    originOnCancel?: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]
  }
  deleteAccount: undefined
  peachFees: undefined
  networkFees: undefined
  aboutPeach: undefined
  bitcoinProducts: undefined
  socials: undefined
  welcome: undefined
  splashScreen: undefined
  myProfile: undefined
  testView: undefined
  testViewButtons: undefined
  testViewPopups: undefined
  testViewMessages: undefined
  testViewComponents: undefined
}

type KeysWithUndefined<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never
}[keyof T]

declare type ScreenWithoutProps = KeysWithUndefined<RootStackParamList>
