declare type RootStackParamList = {
  [key: string]: undefined,
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
    view: 'buyer' | 'seller' | '',
  },
  offers: {},
  offer: {
    offer: SellOffer|BuyOffer,
  },
  settings: {},
}