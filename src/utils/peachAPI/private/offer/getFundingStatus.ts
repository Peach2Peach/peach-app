import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type GetFundingStatusProps = RequestProps & {
  offerId: string
}

/**
 * @description Method to get funding status of offer
 * @param offerId offer id
 * @returns FundingStatus
 */
export const getFundingStatus = async ({
  offerId,
  timeout,
  abortSignal,
}: GetFundingStatusProps): Promise<[FundingStatusResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return await parseResponse<FundingStatusResponse>(response, 'getFundingStatus')
}
