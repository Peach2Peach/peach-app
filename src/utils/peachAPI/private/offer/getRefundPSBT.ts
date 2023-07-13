import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type Props = RequestProps & {
  offerId: string
}

export const getRefundPSBT = async ({ offerId, timeout }: Props) => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/refundPSBT`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<GetRefundPSBTResponseBody>(response, 'getRefundPSBT')
}
