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
export const getContractSummaries = async ({
  timeout,
  abortSignal,
}: GetContractsProps): Promise<[GetContractSummariesResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contracts/summary`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  const parsedResponse = await parseResponse<GetContractSummariesResponse>(response, 'getContractSummaries')

  if (parsedResponse[0]) {
    parsedResponse[0] = parsedResponse[0].map((contract) => ({
      ...contract,
      creationDate: new Date(contract.creationDate),
      lastModified: new Date(contract.lastModified),
      paymentMade: contract.paymentMade ? new Date(contract.paymentMade) : undefined,
    }))
  }

  return parsedResponse
}
