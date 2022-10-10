import { API_URL } from '@env'
import { parseResponse, RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { getAccessToken } from '../user'

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
}: GetFundingStatusProps): Promise<[FundingStatusResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: {
      Authorization: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<FundingStatusResponse>(response, 'getFundingStatus')
}
