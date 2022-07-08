declare type RootStackParamList = {
  [key: string]: {},
  home: {},
  newUser: {},
  login: {},
  restoreBackup: {},
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
    hasMatches?: boolean,
  },
  contract: {
    contractId: Contract['id'],
  },
  contractChat: {
    contractId: Contract['id'],
  },
  dispute: {
    contractId: Contract['id'],
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
    user?: User,
  },
  backups: {},
  seedWords: {},
  escrow: {},
  paymentMethods: {},
  deleteAccount: {},
  fees: {},
  socials: {},
}