import { BIP32Interface } from 'bip32'
import { error } from '../log'
import { parseError } from '../system'

export let accessToken: AccessToken | null
export let peachAccount: BIP32Interface | null

export const setAccessToken = (token: AccessToken) => (accessToken = token)
export const deleteAccessToken = () => (accessToken = null)
export const getPeachAccount = () => peachAccount
export const setPeachAccount = (acc: BIP32Interface) => (peachAccount = acc)
export const deletePeachAccount = () => (peachAccount = null)

export type RequestProps = {
  timeout?: number
}

/**
 * @description Method to check response for error codes
 * @param response response
 * @returns error or null
 */
export const getResponseError = (response: Response): string | null => {
  if (response.status === 0) return 'EMPTY_RESPONSE'
  if (response.status === 500) return 'INTERNAL_SERVER_ERROR'
  if (response.status === 503) return 'SERVICE_UNAVAILABLE'
  if (response.status === 429) return 'TOO_MANY_REQUESTS'
  if (!response.status) return 'NETWORK_ERROR'
  return null
}

/**
 * @description Method to parse and handle peach response
 * @param response response object
 * @param caller calling function name
 * @returns parsed Peach API Response
 */
export const parseResponse = async <T>(response: Response, caller: string): Promise<[T | null, APIError | null]> => {
  try {
    const responseError = getResponseError(response)
    if (responseError) return [null, { error: responseError }]

    const data = await response.json()

    if (response.status !== 200) {
      error(
        `peachAPI - ${caller}`,
        JSON.stringify({
          status: response.status,
          data,
        }),
      )

      return [null, data]
    }
    return [data, null]
  } catch (e) {
    const err = parseError(e)

    error(`peachAPI - ${caller}`, e)

    return [null, { error: err }]
  }
}

export { getStatus, getInfo } from './public/system'
export { sendReport } from './public/contact'
export { getTx, postTx } from './public/bitcoin'
export { marketPrice } from './public/market'
export { getUser } from './public/user'
export { auth, getUserPrivate, getAccessToken, updateUser, getTradingLimit, logoutUser } from './private/user'
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
