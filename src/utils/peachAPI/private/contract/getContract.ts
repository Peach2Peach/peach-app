import fetch, { getAbortSignal } from '../../../fetch'
import { API_URL } from '@env'
import { parseResponse, RequestProps } from '../..'
import { getAccessToken } from '../user'

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
      Authorization: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<GetContractResponse>(response, 'getContract')
}
