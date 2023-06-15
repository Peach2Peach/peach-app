import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type Props = RequestProps & { code: string }

export const redeemReferralCode = async ({ code, timeout }: Props) => {
  const response = await fetch(`${API_URL}/v1/user/referral/redeem/referralCode`, {
    headers: await getPrivateHeaders(),
    method: 'PATCH',
    body: JSON.stringify({
      code,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'redeemReferralCode')
}
