type SellOfferDraft = OfferDraft & {
  type: 'ask'
  amount: number
  premium: number
  returnAddress: string
  funding: FundingStatus
  multi?: number
}
type SellOffer = SellOfferDraft &
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

type BuyOfferDraft = OfferDraft & {
  amount: [number, number]
  type: 'bid'
  releaseAddress: string
  message?: string
  messageSignature?: string
  maxPremium: number | null
}

type BuyOffer = BuyOfferDraft &
  Offer & {
    id: string
    matched: Offer['id'][]
    seenMatches: Offer['id'][]
    maxPremium: number | null
  }
