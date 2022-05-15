import { API_URL } from '@env'
import { getUniqueId } from 'react-native-device-info'
import * as bitcoin from 'bitcoinjs-lib'
import OpenPGP from 'react-native-fast-openpgp'
import { accessToken, peachAccount, parseResponse, setAccessToken } from '..'
import fetch from '../../fetch'
import { error, info, log } from '../../log'

/**
 * @description Method to authenticate with Peach API
 * @returns AccessToken or APIError
 */
export const auth = async (): Promise<[AccessToken|null, APIError|null]> => {
  const message = 'Peach Registration ' + (new Date()).getTime()

  if (!peachAccount) throw new Error('Peach Account not set')

  try {
    const response = await fetch(`${API_URL}/v1/user/auth/`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        publicKey: peachAccount.publicKey.toString('hex'),
        uniqueId: getUniqueId(),
        message,
        signature: peachAccount.sign(bitcoin.crypto.sha256(Buffer.from(message))).toString('hex')
      })
    })


    const token = await response.json() as AccessToken|APIError

    if ('accessToken' in token) {
      setAccessToken(token)
      info('peachAPI - auth - SUCCESS', peachAccount.publicKey.toString('hex'), token)
      return [token, null]
    }

    error('peachAPI - auth - FAILED', new Error((token as APIError).error))
    return [null, token as APIError]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - auth', e)

    return [null, { error: err }]
  }
}

/**
 * @description Method to get and return access token
 * @returns Access Token
 */
export const getAccessToken = async (): Promise<string> => {
  if (accessToken && accessToken.expiry > (new Date()).getTime() + 60 * 1000) {
    log(accessToken.expiry, (new Date()).getTime(), accessToken.expiry > (new Date()).getTime())
    return 'Basic ' + Buffer.from(accessToken.accessToken)
  }

  const [result, err] = await auth()

  if (!result || err) {
    error('peachAPI - getAccessToken', new Error(err?.error))
    throw Error('AUTHENTICATION_FAILURE')
  }

  return 'Basic ' + Buffer.from(result.accessToken)
}

/**
 * @description Method to send pgp keys of user to peach
 * @param pgp PGP public key
 * @returns APISuccess
 */
export const setPGP = async (pgp: PGPKeychain): Promise<[APISuccess|null, APIError|null]> => {
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]

  const message = 'Peach new PGP key ' + (new Date()).getTime()
  const pgpSignature = await OpenPGP.sign(message, pgp.publicKey, pgp.privateKey, '')

  const response = await fetch(`${API_URL}/v1/user/pgp`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      publicKey: peachAccount.publicKey.toString('hex'),
      pgpPublicKey: pgp.publicKey,
      signature: peachAccount.sign(bitcoin.crypto.sha256(Buffer.from(pgp.publicKey))).toString('hex'),
      message,
      pgpSignature,
    })
  })

  return await parseResponse<APISuccess>(response, 'setPGP')
}


/**
 * @description Method to send fcm token of user to peach for push notification
 * @param fcmToken fcm token
 * @returns APISuccess
 */
export const setFCMToken = async (fcmToken: string): Promise<[APISuccess|null, APIError|null]> => {
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]

  const response = await fetch(`${API_URL}/v1/user/fcm`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      fcmToken,
    })
  })

  return await parseResponse<APISuccess>(response, 'setFCMToken')
}

/**
 * @description Method to get trading limit of user
 * @returns TradingLimit
 */
export const getTradingLimit = async (): Promise<[TradingLimit|null, APIError|null]> => {
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]

  const response = await fetch(`${API_URL}/v1/user/tradingLimit`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<TradingLimit>(response, 'getTradingLimit')
}

/**
 * @description Method to authenticate with Peach WS API
 * @param ws the websocket
 */
export const authWS = (ws: WebSocket) => {
  const message = 'Peach Registration ' + (new Date()).getTime()

  if (!peachAccount) throw new Error('Peach Account not set')

  ws.send(JSON.stringify({
    path: '/v1/user/auth',
    publicKey: peachAccount.publicKey.toString('hex'),
    message,
    signature: peachAccount.sign(bitcoin.crypto.sha256(Buffer.from(message))).toString('hex')
  }))
}