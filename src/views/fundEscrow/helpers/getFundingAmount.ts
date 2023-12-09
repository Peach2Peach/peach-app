import { FundMultipleInfo } from '../../../utils/wallet/walletStore'

export const getFundingAmount = (fundMultiple?: FundMultipleInfo, amount = 0) =>
  fundMultiple ? amount * fundMultiple.offerIds.length : amount
