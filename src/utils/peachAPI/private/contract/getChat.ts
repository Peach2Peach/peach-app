import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

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
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<GetChatResponse>(response, 'getChat')
}
