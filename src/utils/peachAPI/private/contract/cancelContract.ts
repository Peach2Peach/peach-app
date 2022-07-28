import fetch from '../../../fetch'
import { API_URL } from '@env'
import { parseResponse } from '../..'
import { getAccessToken } from '../user'

type CancelContractProps = {
  contractId: Contract['id'],
  satsPerByte?: number,
}

/**
 * @description Method to cancel contract
 * @param contractId contract id
 * @returns scuess or error
 */
export const cancelContract = async ({
  contractId,
  satsPerByte,
}: CancelContractProps): Promise<[CancelContractResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/cancel`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      satsPerByte
    })
  })

  return await parseResponse<CancelContractResponse>(response, 'cancelContract')
}