export type RequestProps = {
  timeout?: number
  abortSignal?: AbortSignal
}

export { peachAPI } from './peachAPI'
export {
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
  refundSellOffer,
  reviveSellOffer,
  unmatchOffer,
} from './private/offer'
export {
  auth,
  deletePaymentHash,
  fetchAccessToken,
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
export { getUser } from './public/user'
