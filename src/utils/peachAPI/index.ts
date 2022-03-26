import { API_URL } from '@env'
import { BIP32Interface } from 'bip32'
import { error, info } from '../log'
import { authWS } from './private/user'


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
export { getTx, postTx } from './public/bitcoin'
export { marketPrice } from './public/market'
export { auth, getAccessToken, setPGP } from './private/user'
export {
  postOffer, getOfferDetails,
  createEscrow, getFundingStatus,
  cancelOffer,
  getMatches
} from './private/offer'
export {
  getContract,
  confirmPayment,
  rateUser,
  getChat, postChat,
} from './private/contract'


type PeachWSType = {
  ws: WebSocket,
  authenticated: boolean,
  listeners: {
    message: ((message: string) => void)[]
  },
}
export const websocket = (path: string): PeachWS => {
  const peachWS: PeachWSType = {
    ws: new WebSocket(`${API_URL.replace('http', 'ws')}${path}`),
    authenticated: false,
    listeners: {
      message: [],
    }
  }

  peachWS.ws.onopen = () => authWS(peachWS.ws)
  peachWS.ws.onmessage = (msg) => {
    const message = JSON.parse(msg.data)
    if (!peachWS.authenticated && message.accessToken) {
      info('Peach WS API - authenticated')
      peachWS.authenticated = true
      return
    }
    if (!peachWS.authenticated) return

    peachWS.listeners.message.forEach(listener => listener(message))
  }

  return {
    send: (data: string) => {
      peachWS.ws.send(data)
    },
    onmessage: () => peachWS.authenticated ? peachWS.ws.onmessage : () => {},
    on: (listener: 'message', callback: (message: any) => void) => peachWS.listeners[listener].push(callback)
  }
}
