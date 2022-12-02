import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type GetContractProps = RequestProps & {
  contractId: Contract['id']
}

/**
 * @description Method to get contract
 * @param contractId contract id
 * @returns Contract
 */
export const getContract = async ({
  contractId,
  timeout,
}: GetContractProps): Promise<[GetContractResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<GetContractResponse>(response, 'getContract')
}
