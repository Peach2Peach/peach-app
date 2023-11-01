import { API_URL } from '@env'
import { RequestProps } from '../..'
import { UNIQUEID } from '../../../../constants'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { error, info } from '../../../log'
import { setAccessToken } from '../../accessToken'
import { getResponseError } from '../../getResponseError'
import { getPublicHeaders } from '../../public/getPublicHeaders'
import { TOKENNOTFOUNDERROR } from './constants'

type Props = RequestProps & {
  publicKey: string
  message: string
  signature: string
}

export const register = async ({
  publicKey,
  message,
  signature,
  timeout,
}: Props): Promise<[RegisterResponseBody | null, APIError | null]> => {
  try {
    const response = await fetch(`${API_URL}/v1/user/register/`, {
      headers: getPublicHeaders(),
      method: 'POST',
      body: JSON.stringify({
        publicKey,
        uniqueId: UNIQUEID,
        message,
        signature,
      }),
      signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
    })
    const responseError = getResponseError(response)
    if (responseError) {
      return [null, { error: responseError }]
    }

    const result = response?.json ? ((await response.json()) as RegisterResponseBody | APIError) : null
    if (result && 'accessToken' in result) {
      setAccessToken(result)
      info('peachAPI - register - SUCCESS', publicKey)
      return [result, null]
    } else if (result) {
      const errorMessage = (result as APIError).error
      error('peachAPI - register - FAILED', errorMessage)
      return [null, result as APIError]
    }

    error('peachAPI - register - FAILED', TOKENNOTFOUNDERROR)
    return [null, TOKENNOTFOUNDERROR]
  } catch (e) {
    error('peachAPI - auth', e)
    return [null, { error: 'INTERNAL_SERVER_ERROR' }]
  }
}
