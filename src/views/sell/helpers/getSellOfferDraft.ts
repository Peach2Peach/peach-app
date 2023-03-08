type GetSellOfferDraftParams = {
  sellAmount: number
  premium: number
  meansOfPayment?: MeansOfPayment
  payoutAddress?: string
  kyc?: boolean
  kycType?: KYCType
}

export const getSellOfferDraft = ({
  sellAmount,
  premium,
  meansOfPayment = {},
  payoutAddress = '',
  kyc = false,
  kycType = 'iban',
}: GetSellOfferDraftParams): SellOfferDraft => ({
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
  amount: sellAmount,
  returnAddress: payoutAddress,
  kyc,
  kycType,
})
