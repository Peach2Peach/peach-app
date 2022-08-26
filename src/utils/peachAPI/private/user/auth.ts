import { API_URL } from '@env'
import * as bitcoin from 'bitcoinjs-lib'
import fetch from '../../../fetch'
import { peachAccount, setAccessToken } from '../..'
import { UNIQUEID } from '../../../../constants'
import { error, info } from '../../../log'

/**
 * @description Method to authenticate with Peach API
 * @returns AccessToken or APIError
 */
export const auth = async (): Promise<[AccessToken|null, APIError|null]> => {
  const message = 'Peach Registration ' + (new Date()).getTime()

  if (!peachAccount) {
    const authError = new Error('Peach Account not set')
    error(authError)
    throw authError
  }

  try {
    const response = await fetch(`${API_URL}/v1/user/auth/`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        publicKey: peachAccount.publicKey.toString('hex'),
        uniqueId: UNIQUEID,
        message,
        signature: peachAccount.sign(bitcoin.crypto.sha256(Buffer.from(message))).toString('hex')
      })
    })


    const token = response?.json ? (await response.json() as AccessToken|APIError) : null

    if (token && 'accessToken' in token) {
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
