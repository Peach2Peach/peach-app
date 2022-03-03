import { API_URL } from '@env'
import { parseResponse } from '..'
import { getAccessToken } from './auth'

type GetContractProps = {
  contractId: string,
}

/**
 * @description Method to get contract
 * @param contractId contract id
 * @returns Contract
 */
export const getContract = async ({
  contractId,
}: GetContractProps): Promise<[Contract|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<Contract>(response, 'getContract')
}