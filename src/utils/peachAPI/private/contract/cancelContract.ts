import fetch from '../../../fetch'
import { API_URL } from '@env'
import { parseResponse } from '../..'
import { getAccessToken } from '../user'

type CancelContractProps = {
  contractId: Contract['id'],
}

/**
 * @description Method to cancel contract
 * @param contractId contract id
 * @returns scuess or error
 */
export const cancelContract = async ({
  contractId,
}: CancelContractProps): Promise<[APISuccess|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/cancel`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })

  return await parseResponse<APISuccess>(response, 'cancelContract')
}