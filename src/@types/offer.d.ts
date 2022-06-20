declare type OfferStatus = {
  status: 'escrowWaitingForConfirmation'
    | 'offerPublished'
    | 'searchingForPeer'
    | 'match'
    | 'contractCreated'
    | 'tradeCompleted'
    | 'offerCanceled'
    | 'tradeCanceled'
    | 'null'
  requiredAction: ''
    | 'fundEscrow'
    | 'refundEscrow'
    | 'checkMatches'
    | 'sendKYC'
    | 'confirmKYC'
    | 'sendPayment'
    | 'confirmPayment'
    | 'rate'
    | 'startRefund'
}

declare type SellOffer = Omit<Offer, 'id'> & {
  id?: string,
  type: 'ask',
  premium: number,
  paymentData: Partial<Record<PaymentMethod, string>>,
  kycType?: KYCType,
  returnAddress?: string,
  returnAddressSet?: boolean,
  escrow?: string,
  funding: FundingStatus,
  tx?: string,
  txId?: string,
  released: boolean,
  matched: Offer['id'][],
  seenMatches: Offer['id'][],
}

declare type BuyOffer = Omit<Offer, 'id'> & {
  id?: string,
  type: 'bid'
  releaseAddress?: string,
  matched: Offer['id'][],
  seenMatches: Offer['id'][],
}