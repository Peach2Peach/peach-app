import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type RejectContractCancelationProps = RequestProps & {
  contractId: Contract['id']
}

/**
 * @description Method to reject contract cancelation
 * @param contractId contract id
 * @returns scuess or error
 */
export const rejectContractCancelation = async ({
  contractId,
  timeout,
}: RejectContractCancelationProps): Promise<[APISuccess | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/cancel/reject`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<APISuccess>(response, 'rejectContractCancelation')
}
