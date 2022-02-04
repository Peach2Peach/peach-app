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
  offers: {},
  settings: {},
}