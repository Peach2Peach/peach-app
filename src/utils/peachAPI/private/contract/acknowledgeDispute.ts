import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type AcknowledgeDisputeProps = RequestProps & {
  contractId: Contract['id']
  email?: string
}

/**
 * @description Method to acknowlege a dispute for a contract
 * @param contractId contract id
 */
export const acknowledgeDispute = async ({
  contractId,
  email,
  timeout,
}: AcknowledgeDisputeProps): Promise<[APISuccess | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/dispute/acknowledge`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<APISuccess>(response, 'acknowledgeDispute')
}
