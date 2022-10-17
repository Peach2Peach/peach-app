import { API_URL } from '@env'
import { crypto } from 'bitcoinjs-lib'
import fetch from '../../../fetch'
import { getResponseError, peachAccount, setAccessToken } from '../..'
import { UNIQUEID } from '../../../../constants'
import { error, info } from '../../../log'
import { parseError } from '../../../system'

const tokenNotFoundError = {
  error: 'Token not found',
}

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

    const result = response?.json ? ((await response.json()) as AccessToken | APIError) : null

    if (result && 'accessToken' in result) {
      setAccessToken(result)
      info('peachAPI - auth - SUCCESS', peachAccount.publicKey.toString('hex'), result)
      return [result, null]
    } else if (result) {
      error('peachAPI - auth - FAILED', new Error((result as APIError).error))
      return [null, result as APIError]
    }

    error('peachAPI - auth - FAILED', tokenNotFoundError)
    return [null, tokenNotFoundError as APIError]
  } catch (e) {
    const err = parseError(e)
    error('peachAPI - auth', err)
    return [null, { error: err }]
  }
}
