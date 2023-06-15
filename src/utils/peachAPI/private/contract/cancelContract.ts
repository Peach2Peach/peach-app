import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type CancelContractProps = RequestProps & {
  contractId: Contract['id']
  satsPerByte?: number
}

export const cancelContract = async ({ contractId, satsPerByte, timeout }: CancelContractProps) => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/cancel`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({
      satsPerByte,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<CancelContractResponse>(response, 'cancelContract')
}
