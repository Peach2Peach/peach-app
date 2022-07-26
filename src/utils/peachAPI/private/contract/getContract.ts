import fetch from '../../../fetch'
import { API_URL } from '@env'
import { parseResponse } from '../..'
import { getAccessToken } from '../user'

type GetContractProps = {
  contractId: Contract['id'],
}

/**
 * @description Method to get contract
 * @param contractId contract id
 * @returns Contract
 */
export const getContract = async ({
  contractId,
}: GetContractProps): Promise<[GetContractResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<GetContractResponse>(response, 'getContract')
}