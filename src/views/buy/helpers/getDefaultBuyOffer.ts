type DefaultOfferProps = {
  minBuyAmount: number
  maxBuyAmount: number
  meansOfPayment?: MeansOfPayment
  kyc?: boolean
}
export const getDefaultBuyOffer = ({
  minBuyAmount,
  maxBuyAmount,
  meansOfPayment = {},
  kyc = false,
}: DefaultOfferProps): BuyOfferDraft => ({
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
