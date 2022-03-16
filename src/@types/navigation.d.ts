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
  tradeComplete: {
    view: 'buyer' | 'seller' | '',
  },
  refund: {
    offer: SellOffer,
  },
  offers: {},
  settings: {},
}