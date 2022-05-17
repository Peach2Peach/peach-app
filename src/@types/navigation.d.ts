declare type RootStackParamList = {
  [key: string]: {},
  home: {},
  sell: {
    offer?: SellOffer,
    page?: number
  },
  buy: {
    offer?: BuyOffer,
    page?: number
  },
  search: {
    offer: SellOffer|BuyOffer,
  },
  contract: {
    contractId: string,
  },
  contractChat: {
    contractId: string,
  },
  tradeComplete: {
    contract: Contract,
  },
  offers: {},
  offer: {
    offer: SellOffer|BuyOffer,
  },
  settings: {},
  contact: {},
  report: {
    reason: ContactReason,
  },
  language: {},
  currency: {},
  profile: {
    userId: User['id'],
    user: User,
  },
  backups: {},
  '12Words': {},
  paymentMethods: {},
  deleteAccount: {},
  fees: {},
  socials: {},
}