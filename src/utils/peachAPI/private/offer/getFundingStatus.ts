import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type GetFundingStatusProps = RequestProps & {
  offerId: string
}

export const getFundingStatus = async ({ offerId, timeout, abortSignal }: GetFundingStatusProps) => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return parseResponse<FundingStatusResponse>(response, 'getFundingStatus')
}
