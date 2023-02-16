export type RequestProps = {
  timeout?: number
  abortSignal?: AbortSignal
}

export { getStatus, getInfo } from './public/system'
export { sendReport } from './public/contact'
export { getFeeEstimate, getTx, postTx } from './public/bitcoin'
export { marketPrice } from './public/market'
export { getUser } from './public/user'
export { auth, getUserPrivate, fetchAccessToken, updateUser, getTradingLimit, logoutUser } from './private/user'
export {
  getOffers,
  getOfferSummaries,
  postBuyOffer,
  postSellOffer,
  getOfferDetails,
  patchOffer,
  createEscrow,
  confirmEscrow,
  getFundingStatus,
  cancelOffer,
  getMatches,
  matchOffer,
  unmatchOffer,
  reviveSellOffer,
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
