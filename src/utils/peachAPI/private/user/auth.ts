import { API_URL } from '@env'
import { crypto } from 'bitcoinjs-lib'
import { RequestProps } from '../..'
import { UNIQUEID } from '../../../../constants'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { error, info } from '../../../log'
import { setAccessToken } from '../../accessToken'
import { getAuthenticationChallenge } from '../../getAuthenticationChallenge'
import { getResponseError } from '../../getResponseError'
import { getPeachAccount } from '../../peachAccount'
import { getPublicHeaders } from '../../public/getPublicHeaders'
import { handleMissingPeachAccount } from './handleMissingPeachAccount'
import { TOKENNOTFOUNDERROR } from './constants'

type Props = RequestProps

export const auth = async ({ timeout }: Props): Promise<[AccessToken | null, APIError | null]> => {
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

    error('peachAPI - auth - FAILED', TOKENNOTFOUNDERROR)
    return [null, TOKENNOTFOUNDERROR]
  } catch (e) {
    error('peachAPI - auth', e)
    return [null, { error: 'INTERNAL_SERVER_ERROR' }]
  }
}
