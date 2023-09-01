import { FundMultipleInfo } from '../../../utils/wallet/walletStore'

export const getFundingAmount = (sellOffer?: SellOffer, fundMultiple?: FundMultipleInfo) => {
  if (!sellOffer) return 0

  if (fundMultiple) return sellOffer.amount * fundMultiple.offerIds.length
  return sellOffer.amount
}
