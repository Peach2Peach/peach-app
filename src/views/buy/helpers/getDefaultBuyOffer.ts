type DefaultOfferProps = {
  minAmount: number
  maxAmount: number
  meansOfPayment?: MeansOfPayment
  kyc?: boolean
}
export const getDefaultBuyOffer = ({
  minAmount,
  maxAmount,
  meansOfPayment = {},
  kyc = false,
}: DefaultOfferProps): BuyOfferDraft => ({
  type: 'bid',
  creationDate: new Date(),
  lastModified: new Date(),
  amount: [minAmount, maxAmount],
  meansOfPayment,
  paymentData: {},
  releaseAddress: '',
  originalPaymentData: [],
  kyc,
  tradeStatus: 'messageSigningRequired',
})
