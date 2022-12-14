declare type RootStackParamList = {
  home: undefined
  newUser: {
    referralCode?: string
  }
  login: undefined
  restoreBackup: undefined
  buy: undefined
  sell: undefined
  buyPreferences: { amount: number }
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
  fundEscrow: {
    offer: SellOffer
  }
  setReturnAddress: {
    offer: SellOffer
  }
  search: {
    offer: SellOffer | BuyOffer
    hasMatches?: boolean
  }
  contract: {
    contractId: Contract['id']
    contract?: Contract
  }
  contractChat: {
    contractId: Contract['id']
  }
  dispute: {
    contractId: Contract['id']
  }
  tradeComplete: {
    contract: Contract
  }
  yourTrades: undefined
  offer: {
    offer: SellOffer | BuyOffer
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
  profile: {
    userId: User['id']
    user?: User
  }
  referrals: undefined
  backups: undefined
  seedWords: undefined
  refundAddress: undefined
  paymentMethods: undefined
  deleteAccount: undefined
  fees: undefined
  socials: undefined
  testView: undefined
  testViewButtons: undefined
  testViewPopups: undefined
  reportFullScreen: undefined
  welcome: undefined
  splashScreen: undefined
}
