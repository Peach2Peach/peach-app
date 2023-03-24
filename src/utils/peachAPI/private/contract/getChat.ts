import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type GetChatProps = RequestProps & {
  contractId: Contract['id']
  page?: number
}

/**
 * @description Method to get contract chat
 * @param contractId contract id
 * @param [page] page
 * @returns Chat log
 */
export const getChat = async ({
  contractId,
  page = 0,
  timeout,
}: GetChatProps): Promise<[GetChatResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/chat?page=${page}`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  const parsedResponse = await parseResponse<GetChatResponse>(response, 'getChat')

  if (parsedResponse[0]) {
    parsedResponse[0] = parsedResponse[0].map((message) => ({
      ...message,
      date: new Date(message.date),
    }))
  }

  return parsedResponse
}
