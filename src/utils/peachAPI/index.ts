export type RequestProps = {
  timeout?: number
  abortSignal?: AbortSignal
}

export { getStatus, getInfo } from './public/system'
export { sendReport } from './public/contact'
export { getFeeEstimate, getTx, postTx } from './public/bitcoin'
export { marketPrice } from './public/market'
export { checkReferralCode, getUser } from './public/user'
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
  updateUser,
} from './private/user'
export {
  cancelOffer,
  confirmEscrow,
  createEscrow,
  getFundingStatus,
  getMatches,
  getOfferDetails,
  getOffers,
  getOfferSummaries,
  matchOffer,
  patchOffer,
  postBuyOffer,
  postSellOffer,
  refundSellOffer,
  reviveSellOffer,
  unmatchOffer,
} from './private/offer'
export {
  cancelContract,
  confirmContractCancelation,
  rejectContractCancelation,
  getContract,
  getContracts,
  getContractSummaries,
  confirmPayment,
  rateUser,
  getChat,
  postChat,
  raiseDispute,
  extendPaymentTimer,
} from './private/contract'

export { fundEscrow, generateBlock } from './regtest'
