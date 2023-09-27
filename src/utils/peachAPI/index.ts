import { API_URL } from '@env'
import { default as apiWrapper } from 'peach-api'
import { UNIQUEID } from '../../constants'
import { getPeachAccount } from './peachAccount'

export type RequestProps = {
  timeout?: number
  abortSignal?: AbortSignal
}

export {
  confirmPayment,
  getChat,
  getContract,
  getContractSummaries,
  getContracts,
  raiseDispute,
} from './private/contract'
export {
  cancelOffer,
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
  logoutUser,
  redeemNoPeachFees,
  redeemReferralCode,
  register,
  setBatching,
  updateUser,
} from './private/user'
export { getFeeEstimate, postTx } from './public/bitcoin'
export { sendReport } from './public/contact'
export { getInfo, getStatus } from './public/system'
export { checkReferralCode, getUser } from './public/user'

export const peachAPI = apiWrapper({ peachAccount: getPeachAccount()!, uniqueId: UNIQUEID, url: API_URL })
