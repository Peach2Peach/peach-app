export type RequestProps = {
  timeout?: number
}

export { getStatus, getInfo } from './public/system'
export { sendReport } from './public/contact'
export { getTx, postTx } from './public/bitcoin'
export { marketPrice } from './public/market'
export { getUser } from './public/user'
export { auth, getUserPrivate, fetchAccessToken, updateUser, getTradingLimit, logoutUser } from './private/user'
export {
  getOffers,
  postOffer,
  getOfferDetails,
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
  confirmPayment,
  rateUser,
  getChat,
  postChat,
  raiseDispute,
} from './private/contract'

export { fundEscrow, generateBlock } from './regtest'
