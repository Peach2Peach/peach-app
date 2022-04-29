declare type OfferStatus = {
  status: 'escrowWaitingForConfirmation'
  | 'offerPublished'
  | 'match'
  | 'contractCreated'
  | 'tradeCompleted'
  | 'offerCanceled'
  | 'tradeCanceled'
  | 'null',
  actionRequired: boolean,
}

declare type SellOffer = Offer & {
  type: 'ask',
  premium: number,
  paymentData: PaymentData[],
  kycType?: KYCType,
  returnAddress?: string,
  confirmedReturnAddress?: boolean,
  escrow?: string,
  funding?: FundingStatus,
  tx?: string,
  txId?: string,
  refunded: boolean,
  released: boolean,
  seenMatches: Offer['id'][],
}

declare type BuyOffer = Offer & {
  type: 'bid'
  releaseAddress?: string,
  matched: Offer['id'][],
  seenMatches: Offer['id'][],
}