import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type AcknowledgeDisputeProps = RequestProps & {
  contractId: Contract['id']
  email?: string
}

export const acknowledgeDispute = async ({ contractId, email, timeout }: AcknowledgeDisputeProps) => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/dispute/acknowledge`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'acknowledgeDispute')
}
