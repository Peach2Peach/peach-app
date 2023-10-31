import { ESPLORA_URL } from '@env'
import fetch from '../fetch'
import { getAbortWithTimeout } from '../getAbortWithTimeout'
import { RequestProps } from '../peachAPI'
import { parseResponse } from '../peachAPI/parseResponse'
import { getPublicHeaders } from '../peachAPI/public/getPublicHeaders'

export const getFeeEstimates = async ({ timeout, abortSignal }: RequestProps) => {
  const response = await fetch(`${ESPLORA_URL}/fee-estimates`, {
    headers: getPublicHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return parseResponse<ConfirmationTargets>(response, 'getFeeEstimates', false)
}
