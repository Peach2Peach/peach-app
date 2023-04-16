import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

type CheckReferralCodeProps = RequestProps & {
  code: string
}

export const checkReferralCode = async ({
  code,
  timeout,
}: CheckReferralCodeProps): Promise<[CheckReferralCodeResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/user/referral?code=${code}`, {
    headers: getPublicHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<CheckReferralCodeResponse>(response, 'checkReferralCode')
}
