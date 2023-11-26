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
