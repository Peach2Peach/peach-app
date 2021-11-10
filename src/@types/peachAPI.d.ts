
declare type AccessToken = {
  expiry: number,
  accessToken: string
}

declare type APIError = {
  error: string
}

declare type Currency = 'EUR' | 'GBP' | 'CHF' | 'SEK'

declare type TradingPair = 'BTCEUR' | 'BTCCHF' | 'BTCGBP'

declare type PeachPairInfo = {
  pair: TradingPair,
  price: number,
}