import { API_URL } from '@env'
import { peachAPI as peachAPIBuilder } from '../../../peach-api'
import { UNIQUEID } from '../../constants'
import { getPeachAccount } from './peachAccount'

export type RequestProps = {
  timeout?: number
  abortSignal?: AbortSignal
}

export {
  cancelContract,
  confirmContractCancelation,
  confirmPayment,
  extendPaymentTimer,
  getChat,
  getContract,
  getContractSummaries,
  getContracts,
  postChat,
  raiseDispute,
  rateUser,
  rejectContractCancelation,
} from './private/contract'
export {
  cancelOffer,
  confirmEscrow,
  createEscrow,
  getFundingStatus,
  getMatches,
  getOfferDetails,
  getOfferSummaries,
  getOffers,
  getRefundPSBT,
  matchOffer,
  patchOffer,
  postBuyOffer,
  postSellOffer,
  refundSellOffer,
  reviveSellOffer,
  unmatchOffer,
} from './private/offer'
export {
  auth,
  deletePaymentHash,
  fetchAccessToken,
  getSelfUser,
  getTradingLimit,
  getUserPaymentMethodInfo,
  logoutUser,
  redeemNoPeachFees,
  redeemReferralCode,
  register,
  setBatching,
  updateUser,
} from './private/user'
export { getFeeEstimate, postTx } from './public/bitcoin'
export { sendReport } from './public/contact'
export { marketPrice } from './public/market'
export { getInfo, getStatus } from './public/system'
export { checkReferralCode, getUser } from './public/user'

export const peachAPI = peachAPIBuilder({
  url: API_URL,
  peachAccount: getPeachAccount(),
  uniqueId: UNIQUEID,
})
