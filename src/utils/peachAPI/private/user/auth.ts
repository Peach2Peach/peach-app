import { API_URL } from '@env'
import { crypto } from 'bitcoinjs-lib'
import fetch from '../../../fetch'
import { getResponseError, peachAccount, setAccessToken } from '../..'
import { UNIQUEID } from '../../../../constants'
import { error, info } from '../../../log'
import { parseError } from '../../../system'

/**
 * @description Method to authenticate with Peach API
 * @returns AccessToken or APIError
 */
export const auth = async (): Promise<[AccessToken | null, APIError | null]> => {
  const message = 'Peach Registration ' + new Date().getTime()

  if (!peachAccount) {
    const authError = new Error('Peach Account not set')
    error(authError)
    throw authError
  }

  try {
    const response = await fetch(`${API_URL}/v1/user/auth/`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        publicKey: peachAccount.publicKey.toString('hex'),
        uniqueId: UNIQUEID,
        message,
        signature: peachAccount.sign(crypto.sha256(Buffer.from(message))).toString('hex'),
      }),
    })

    const responseError = getResponseError(response)
    if (responseError) return [null, { error: responseError }]

    const token = response?.json ? ((await response.json()) as AccessToken | APIError) : null

    if (token && 'accessToken' in token) {
      setAccessToken(token)
      info('peachAPI - auth - SUCCESS', peachAccount.publicKey.toString('hex'), token)
      return [token, null]
    }

    error('peachAPI - auth - FAILED', new Error((token as APIError).error))
    return [null, token as APIError]
  } catch (e) {
    const err = parseError(e)
    error('peachAPI - auth', err)

    return [null, { error: err }]
  }
}
