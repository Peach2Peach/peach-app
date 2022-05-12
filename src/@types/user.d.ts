declare type Rating = {
  creationDate: Date,
  rating: -1 | 1,
  ratedBy: string,
  signature: string,
}
declare type Medal = 'fastTrader' | 'superTrader'

declare type User = {
  id: string,
  creationDate: Date,
  trades: number,
  rating: number,
  userRating: number,
  ratingCount: number,
  peachRating: number,
  ratings?: Rating[],
  medals: Medal[],
  pgpPublicKey: string,
  pgpPublicKeyProof: string,
}
