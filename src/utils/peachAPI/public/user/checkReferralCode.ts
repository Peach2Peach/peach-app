import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'

type CheckReferralCodeProps = RequestProps & {
  code: string
}

export const checkReferralCode = async ({
  code,
  timeout,
}: CheckReferralCodeProps): Promise<[CheckReferralCodeResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/user/referral?code=${code}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<CheckReferralCodeResponse>(response, 'checkReferralCode')
}
