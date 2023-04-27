import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

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
    headers: await getPrivateHeaders(),
    method: 'POST',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<APISuccess>(response, 'rejectContractCancelation')
}
