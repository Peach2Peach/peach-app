import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

export const getMeetupEvents = async ({ timeout }: RequestProps): Promise<[MeetupEvent[] | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/events`, {
    headers: {
      ...getPublicHeaders(),
      'Cache-Control': 'no-cache',
    },
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<MeetupEvent[]>(response, 'getMeetupEvents')
}
