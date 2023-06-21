import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

export const getFeeEstimate = async ({ timeout, abortSignal }: RequestProps) => {
  const response = await fetch(`${API_URL}/v1/estimateFees`, {
    headers: getPublicHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return parseResponse<GetFeeEstimateResponse>(response, 'postTx')
}
