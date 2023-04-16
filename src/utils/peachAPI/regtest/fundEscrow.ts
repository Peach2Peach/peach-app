import { API_URL } from '@env'
import { RequestProps } from '..'
import fetch from '../../fetch'
import { getAbortWithTimeout } from '../../getAbortWithTimeout'
import { parseResponse } from '../parseResponse'
import { getPublicHeaders } from '../public/getPublicHeaders'

type FundEscrowProps = RequestProps & {
  offerId: Offer['id']
}

/**
 * @description Method to fund an offer on regtest
 * @param offerId offer id
 * @returns FundEscrowResponse
 */
export const fundEscrow = async ({
  offerId,
  timeout,
}: FundEscrowProps): Promise<[FundEscrowResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/regtest/offer/${offerId}/fundEscrow`, {
    headers: getPublicHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<FundEscrowResponse>(response, 'fundEscrow')
}
