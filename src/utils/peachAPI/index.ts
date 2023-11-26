export type RequestProps = {
  timeout?: number
  abortSignal?: AbortSignal
}

export { peachAPI } from './peachAPI'
export { cancelOffer, getOfferDetails } from './private/offer'
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
export { marketPrice } from './public/market'
export { getInfo, getStatus } from './public/system'
export { getUser } from './public/user'
