import { API_URL } from '@env'
import { RequestProps } from '..'
import { getAbortWithTimeout } from '../../fetch'
import { parseResponse } from '../parseResponse'

/**
 * @description Method to get market prices
 * @returns Pricebook
 */
export const getMeetupEvents = async ({ timeout }: RequestProps): Promise<[MeetupEvent[] | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/events`, {
    headers: {
      'Cache-Control': 'no-cache',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<MeetupEvent[]>(response, 'getMeetupEvents')
}
