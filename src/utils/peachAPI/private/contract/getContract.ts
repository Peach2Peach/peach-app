import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

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
  abortSignal,
}: GetContractProps): Promise<[GetContractResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return await parseResponse<GetContractResponse>(response, 'getContract')
}
