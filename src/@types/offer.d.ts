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
    returnAddress: string
    escrow?: string
    tx?: string
    refundTx?: string // base 64 encoded psbt
    txId?: string
    released: boolean
    returnAddress: string
    matched: Offer['id'][]
    seenMatches: Offer['id'][]
  }

declare type BuyOfferDraft = OfferDraft & {
  amount: [number, number]
  type: 'bid'
  releaseAddress: string
}

declare type BuyOffer = BuyOfferDraft &
  Offer & {
    id: string
    message: string
    messageSignature?: string
    matched: Offer['id'][]
    seenMatches: Offer['id'][]
  }
