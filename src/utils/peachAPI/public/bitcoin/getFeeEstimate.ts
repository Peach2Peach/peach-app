import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'

type GetFeeEstimateProps = RequestProps

export const getFeeEstimate = async ({
  timeout,
  abortSignal,
}: GetFeeEstimateProps): Promise<[GetFeeEstimateResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/estimateFees`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return await parseResponse<GetFeeEstimateResponse>(response, 'postTx')
}
