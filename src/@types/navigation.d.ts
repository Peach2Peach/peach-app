declare type RootStackParamList = {
  [key: string]: undefined,
  sell: {
    offer?: SellOffer,
    page?: number
  },
  buy: {
    offer?: BuyOffer,
    page?: number
  }
}