declare type SellOffer = Omit<Offer, 'id'> & {
  id?: string
  type: 'ask'
  amount: number
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
  amount: [number, number]
  type: 'bid'
  releaseAddress?: string
  message: string
  messageSignature?: string
  matched: Offer['id'][]
  seenMatches: Offer['id'][]
}

declare type RefundingStatus = {
  psbt?: Psbt
  tx?: string
  txId?: string | null
  err?: string | null
}
