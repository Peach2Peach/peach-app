import { getDefaultFundingStatus } from '../../../utils/offer'

type GetSellOfferDraftParams = {
  sellAmount: number
  premium: number
  meansOfPayment?: MeansOfPayment
  payoutAddress?: string
}

export const getSellOfferDraft = ({
  sellAmount,
  premium,
  meansOfPayment = {},
  payoutAddress = '',
}: GetSellOfferDraftParams): SellOfferDraft => ({
  type: 'ask',
  creationDate: new Date(),
  lastModified: new Date(),
  tradeStatus: 'fundEscrow',
  premium,
  meansOfPayment,
  paymentData: {},
  originalPaymentData: [],
  funding: getDefaultFundingStatus(),
  amount: sellAmount,
  returnAddress: payoutAddress,
})
