declare type SellOfferDraft = OfferDraft & {
  type: 'ask'
  amount: number
  premium: number
  kycType?: KYCType
  returnAddress: string
  funding: FundingStatus
}
declare type SellOffer = SellOfferDraft &
  Offer & {
    id: string
    escrow?: string
    tx?: string
    refundTx?: string // base 64 encoded psbt
    txId?: string
    released: boolean
    matched: Offer['id'][]
    seenMatches: Offer['id'][]
  }

declare type BuyOfferDraft = OfferDraft & {
  amount: [number, number]
  type: 'bid'
  releaseAddress: string
  message?: string
  messageSignature?: string
}

declare type BuyOffer = BuyOfferDraft &
  Offer & {
    id: string
    matched: Offer['id'][]
    seenMatches: Offer['id'][]
  }
