import { API_URL } from '@env'
import { default as apiWrapper } from 'peach-api'
import { UNIQUEID } from '../../constants'
import { getPeachAccount } from './peachAccount'

export type RequestProps = {
  timeout?: number
  abortSignal?: AbortSignal
}

export { getChat, getContract, getContractSummaries, getContracts, raiseDispute } from './private/contract'
export {
  cancelOffer,
  getMatches,
  getOfferDetails,
  getOfferSummaries,
  getOffers,
  matchOffer,
  patchOffer,
  postBuyOffer,
  postSellOffer,
} from './private/offer'
export { auth, fetchAccessToken, getTradingLimit, register, setBatching, updateUser } from './private/user'

export const peachAPI = apiWrapper({ peachAccount: getPeachAccount()!, uniqueId: UNIQUEID, url: API_URL })
