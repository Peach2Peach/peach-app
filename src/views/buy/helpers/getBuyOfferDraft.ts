type GetBuyOfferDraftArgs = {
  minBuyAmount: number
  maxBuyAmount: number
  meansOfPayment?: MeansOfPayment
  kyc?: boolean
}
export const getBuyOfferDraft = ({
  minBuyAmount,
  maxBuyAmount,
  meansOfPayment = {},
  kyc = false,
}: GetBuyOfferDraftArgs): BuyOfferDraft => ({
  type: 'bid',
  creationDate: new Date(),
  lastModified: new Date(),
  amount: [minBuyAmount, maxBuyAmount],
  meansOfPayment,
  paymentData: {},
  releaseAddress: '',
  originalPaymentData: [],
  kyc,
})
