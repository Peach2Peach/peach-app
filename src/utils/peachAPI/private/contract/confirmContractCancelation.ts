import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type ConfirmContractCancelationProps = RequestProps & {
  contractId: Contract['id']
}

/**
 * @description Method to confirm contract cancelation
 * @param contractId contract id
 * @returns scuess or error
 */
export const confirmContractCancelation = async ({
  contractId,
  timeout,
}: ConfirmContractCancelationProps): Promise<[APISuccess | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/cancel/confirm`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<APISuccess>(response, 'confirmContractCancelation')
}
