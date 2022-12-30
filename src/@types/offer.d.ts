declare type TradeStatus = {
  // waiting for seller // ??
  // waiting for payment // ??
  status:
    | 'escrowWaitingForConfirmation' // waiting for network confirm
    | 'returnAddressRequired' // ?? this goes with 'provideReturnAddress' action
    | 'offerPublished' // ?? could be 'checkMatches', or directly this doesn't exist and 'searchingForPeer'
    | 'searchingForPeer' // looking for match
    | 'match' // ??
    | 'contractCreated'
    | 'tradeCompleted' // past
    | 'offerCanceled' // past
    | 'tradeCanceled' // past
    | 'null'
  requiredAction:
    | ''
    | 'fundEscrow' // fund escrow
    | 'provideReturnAddress' // ??
    | 'refundEscrow' // fund escrow -> refund escrow // ??
    | 'checkMatches' // select match
    | 'sendKYC' // ??
    | 'confirmKYC' // ??
    | 'sendPayment' // make payment
    | 'confirmPayment' // confirm payment
    | 'dispute' // dispute started
    | 'acknowledgeDisputeResult' // ??
    | 'confirmCancelation' // buyer / seller wants to cancel (check offer)
    | 'rate' // rate seller / buyer
    | 'startRefund' // ??
}

declare type SellOffer = Omit<Offer, 'id'> & {
  id?: string
  type: 'ask'
  premium: number
  kycType?: KYCType
  returnAddress?: string
  returnAddressSet?: boolean
  returnAddressRequired?: boolean
  escrow?: string
  funding: FundingStatus
  tx?: string
  refundTx?: string // base 64 encoded psbt
  txId?: string
  released: boolean
  matched: Offer['id'][]
  seenMatches: Offer['id'][]
}

declare type BuyOffer = Omit<Offer, 'id'> & {
  id?: string
  type: 'bid'
  releaseAddress?: string
  matched: Offer['id'][]
  seenMatches: Offer['id'][]
}

declare type RefundingStatus = {
  psbt?: Psbt
  tx?: string
  txId?: string | null
  err?: string | null
}
