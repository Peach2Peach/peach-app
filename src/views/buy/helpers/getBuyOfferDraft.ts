type GetBuyOfferDraftParams = {
  minBuyAmount: number
  maxBuyAmount: number
  meansOfPayment?: MeansOfPayment
}
export const getBuyOfferDraft = ({
  minBuyAmount,
  maxBuyAmount,
  meansOfPayment = {},
}: GetBuyOfferDraftParams): BuyOfferDraft => ({
  type: 'bid',
  creationDate: new Date(),
  lastModified: new Date(),
  amount: [minBuyAmount, maxBuyAmount],
  meansOfPayment,
  paymentData: {},
  releaseAddress: '',
  originalPaymentData: [],
})
