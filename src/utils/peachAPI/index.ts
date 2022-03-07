import { BIP32Interface } from 'bip32'
import { error } from '../logUtils'


export let accessToken: AccessToken|null
export let peachAccount: BIP32Interface|null

export const setAccessToken = (token: AccessToken) => accessToken = token
export const getPeachAccount = () => peachAccount
export const setPeachAccount = (acc: BIP32Interface) => peachAccount = acc

/**
 * @description Method to parse and handle peach response
 * @param response response object
 * @param caller calling function name
 * @returns parsed Peach API Response
 */
export const parseResponse = async <T>(
  response: Response,
  caller: string,
): Promise<[T|null, APIError|null]> => {
  try {
    const data = await response.json()
    if (response.status !== 200) {
      error(`peachAPI - ${caller}`, {
        status: response.status,
        data
      })

      return [null, data]
    }
    return [data, null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error(`peachAPI - ${caller}`, e)


    return [null, { error: err }]
  }
}

export { getTx, postTx } from './public/bitcoin'
export { marketPrice } from './public/market'
export { userAuth, getAccessToken } from './private/auth'
export {
  postOffer,
  createEscrow,
  getFundingStatus,
  cancelOffer,
  getMatches
} from './private/offer'
export { getContract } from './private/contract'
