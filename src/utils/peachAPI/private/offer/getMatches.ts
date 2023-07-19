import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type GetMatchesProps = RequestProps & {
  offerId: string
  page?: number
  size?: number
  sortBy?: Sorter[]
}

export const getMatches = async ({
  offerId,
  page = 0,
  size = 21,
  sortBy = ['highestAmount'],
  timeout,
  abortSignal,
}: GetMatchesProps) => {
  const response = await fetch(
    `${API_URL}/v1/offer/${offerId}/matches?page=${page}&size=${size}&sortBy=${sortBy.join(',')}`,
    {
      headers: await getPrivateHeaders(),
      method: 'GET',
      signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
    },
  )

  return parseResponse<GetMatchesResponse>(response, 'getMatches')
}
