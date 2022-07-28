import fetch from '../../../fetch'
import { API_URL } from '@env'
import { parseResponse } from '../..'
import { getAccessToken } from '../user'

type RejectContractCancelationProps = {
  contractId: Contract['id'],
}

/**
 * @description Method to reject contract cancelation
 * @param contractId contract id
 * @returns scuess or error
 */
export const rejectContractCancelation = async ({
  contractId,
}: RejectContractCancelationProps): Promise<[APISuccess|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/cancel/reject`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })

  return await parseResponse<APISuccess>(response, 'rejectContractCancelation')
}