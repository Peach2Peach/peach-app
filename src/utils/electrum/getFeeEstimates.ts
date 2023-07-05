import { BLOCKEXPLORER } from '@env'
import { getAbortWithTimeout } from '../getAbortWithTimeout'
import { RequestProps } from '../peachAPI'
import { parseResponse } from '../peachAPI/parseResponse'
import { getPublicHeaders } from '../peachAPI/public/getPublicHeaders'
import fetch from '../fetch'

export const getFeeEstimates = async ({ timeout, abortSignal }: RequestProps) => {
  const response = await fetch(`${BLOCKEXPLORER}/fee-estimates`, {
    headers: getPublicHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return parseResponse<ConfirmationTargets>(response, 'getFeeEstimates', false)
}
