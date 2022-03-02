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
  offers: {},
  settings: {},
}