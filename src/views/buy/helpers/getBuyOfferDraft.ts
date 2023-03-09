type GetBuyOfferDraftParams = {
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
}: GetBuyOfferDraftParams): BuyOfferDraft => ({
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
