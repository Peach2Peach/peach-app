import { API_URL } from '@env'
import { crypto } from 'bitcoinjs-lib'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { RequestProps } from '../..'
import { UNIQUEID } from '../../../../constants'
import { error, info } from '../../../log'
import { parseError } from '../../../system'
import { getPeachAccount } from '../../peachAccount'
import { getResponseError } from '../../getResponseError'
import { setAccessToken } from '../../accessToken'
import { getAuthenticationChallenge } from '../../getAuthenticationChallenge'

const tokenNotFoundError = {
  error: 'Token not found',
}

type AuthProps = RequestProps

/**
 * @description Method to handle missing peach account.
 * This method should ideally never be called but serves as messenger if something goes wrong
 */
const handleMissingPeachAccount = () => {
  const authError = new Error('Peach Account not set')
  error(authError)
  throw authError
}

/**
 * @description Method to authenticate with Peach API
 * @returns AccessToken or APIError
 */
export const auth = async ({ timeout }: AuthProps): Promise<[AccessToken | null, APIError | null]> => {
  const message = getAuthenticationChallenge()
  const peachAccount = getPeachAccount()

  if (!peachAccount) return handleMissingPeachAccount()

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
      signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
    })
    const responseError = getResponseError(response)
    if (responseError) return [null, { error: responseError }]

    const result = response?.json ? ((await response.json()) as AccessToken | APIError) : null

    if (result && 'accessToken' in result) {
      setAccessToken(result)
      info('peachAPI - auth - SUCCESS', peachAccount.publicKey.toString('hex'), result)
      return [result, null]
    } else if (result) {
      const errorMessage = (result as APIError).error
      error('peachAPI - auth - FAILED', errorMessage === 'NETWORK_ERROR' ? errorMessage : new Error(errorMessage))
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
