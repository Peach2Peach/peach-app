import { API_URL } from '@env'
import { RequestProps } from '..'
import fetch from '../../fetch'
import { getAbortWithTimeout } from '../../getAbortWithTimeout'
import { parseResponse } from '../parseResponse'
import { getPublicHeaders } from '../public/getPublicHeaders'

type FundEscrowProps = RequestProps & {
  offerId: Offer['id']
}

export const fundEscrow = async ({ offerId, timeout }: FundEscrowProps) => {
  const response = await fetch(`${API_URL}/v1/regtest/offer/${offerId}/fundEscrow`, {
    headers: getPublicHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<FundEscrowResponse>(response, 'fundEscrow')
}
