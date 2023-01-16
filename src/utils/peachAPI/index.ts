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
  postOffer,
  getOfferDetails,
  signMessageToPublish,
  patchOffer,
  createEscrow,
  getFundingStatus,
  cancelOffer,
  getMatches,
  matchOffer,
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
} from './private/contract'

export { fundEscrow, generateBlock } from './regtest'
