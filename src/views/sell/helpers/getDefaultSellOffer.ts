type DefaultOfferProps = {
  minAmount: number
  premium: number
  meansOfPayment?: MeansOfPayment
  payoutAddress?: string
  kyc?: boolean
  kycType?: KYCType
}

export const getDefaultSellOffer = ({
  minAmount,
  premium,
  meansOfPayment = {},
  payoutAddress = '',
  kyc = false,
  kycType = 'iban',
}: DefaultOfferProps): SellOfferDraft => ({
  type: 'ask',
  creationDate: new Date(),
  lastModified: new Date(),
  tradeStatus: 'fundEscrow',
  premium,
  meansOfPayment,
  paymentData: {},
  originalPaymentData: [],
  funding: {
    status: 'NULL',
    txIds: [],
    vouts: [],
    amounts: [],
    expiry: 537,
  },
  amount: minAmount,
  returnAddress: payoutAddress,
  kyc,
  kycType,
})
