declare type RootStackParamList = {
  home: {}
  newUser: {}
  login: {}
  restoreBackup: {}
  buy: {}
  buyPreferences: {
    amount: number
    offer?: BuyOffer
    page?: number
  }
  sell: {}
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
  yourTrades: {}
  offer: {
    offer: SellOffer | BuyOffer
  }
  settings: {}
  contact: {}
  report: {
    reason: ContactReason
    topic?: string
    message?: string
    shareDeviceID?: boolean
  }
  language: {}
  currency: {}
  profile: {
    userId: User['id']
    user?: User
  }
  referrals: {}
  backups: {}
  seedWords: {}
  escrow: {}
  paymentMethods: {}
  deleteAccount: {}
  fees: {}
  socials: {}
  sellPreferences: {
    amount: number
  }
  reportFullScreen: {}
  splashScreen: {}
  welcome: {}
}
