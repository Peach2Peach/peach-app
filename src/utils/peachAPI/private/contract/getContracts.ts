import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type GetContractsProps = RequestProps

/**
 * @description Method to get contracts
 * @returns Contracts
 */
export const getContracts = async ({
  timeout,
  abortSignal,
}: GetContractsProps): Promise<[GetContractsResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contracts`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  const parsedResponse = await parseResponse<GetContractsResponse>(response, 'getContract')

  if (parsedResponse[0]) {
    parsedResponse[0] = parsedResponse[0].map((contract) => {
      contract.lastModified = new Date(contract.lastModified)

      return contract
    })
  }

  return parsedResponse
}
