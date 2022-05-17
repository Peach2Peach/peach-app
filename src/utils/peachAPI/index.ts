import * as bitcoin from 'bitcoinjs-lib'
import { error } from '../log'


export let accessToken: AccessToken|null
export let peachAccount: bitcoin.bip32.BIP32Interface|null

export const setAccessToken = (token: AccessToken) => accessToken = token
export const deleteAccessToken = () => accessToken = null
export const getPeachAccount = () => peachAccount
export const setPeachAccount = (acc: bitcoin.bip32.BIP32Interface) => peachAccount = acc

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
    if (!response.status) {
      return [null, { error: 'NETWORK_ERROR' }]
    }

    const data = await response.json()

    if (response.status !== 200) {
      error(`peachAPI - ${caller}`, JSON.stringify({
        status: response.status,
        data
      }))

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

export { getStatus, getInfo } from './public/system'
export { sendReport } from './public/contact'
export { getTx, postTx } from './public/bitcoin'
export { marketPrice } from './public/market'
export { getUser } from './public/user'
export { auth, getAccessToken, setPGP, setFCMToken, getTradingLimit } from './private/user'
export {
  getOffers,
  postOffer, getOfferDetails, patchOffer,
  createEscrow, getFundingStatus,
  cancelOffer,
  getMatches
} from './private/offer'
export {
  getContract,
  getContracts,
  confirmPayment,
  rateUser,
  getChat, postChat,
} from './private/contract'
