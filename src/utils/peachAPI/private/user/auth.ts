import { API_URL } from '@env'
import { crypto } from 'bitcoinjs-lib'
import { RequestProps } from '../..'
import { UNIQUEID } from '../../../../constants'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { error, info } from '../../../log'
import { setAccessToken } from '../../accessToken'
import { getAuthenticationChallenge } from '../../getAuthenticationChallenge'
import { getResponseError } from '../../getResponseError'
import { getPeachAccount } from '../../peachAccount'
import { getPublicHeaders } from '../../public/getPublicHeaders'

const tokenNotFoundError: APIError = {
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
  const peachAccount = getPeachAccount()
  const message = getAuthenticationChallenge()

  if (!peachAccount) return handleMissingPeachAccount()

  try {
    const response = await fetch(`${API_URL}/v1/user/auth/`, {
      headers: getPublicHeaders(),
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
      error('peachAPI - auth - FAILED', errorMessage)
      return [null, result as APIError]
    }

    error('peachAPI - auth - FAILED', tokenNotFoundError)
    return [null, tokenNotFoundError]
  } catch (e) {
    error('peachAPI - auth', e)
    return [null, { error: 'INTERNAL_SERVER_ERROR' }]
  }
}
