import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

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
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return await parseResponse<FundingStatusResponse>(response, 'getFundingStatus')
}
