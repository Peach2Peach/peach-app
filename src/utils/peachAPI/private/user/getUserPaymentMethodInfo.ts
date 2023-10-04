import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

export const getUserPaymentMethodInfo = async ({ timeout }: RequestProps) => {
  const response = await fetch(`${API_URL}/v1/user/me/paymentMethods`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<GetUserPaymentMethodInfoResponseBody>(response, 'getUserPaymentMethodInfo')
}
