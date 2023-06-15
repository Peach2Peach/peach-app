import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type RaiseDisputeProps = RequestProps & {
  contractId: Contract['id']
  email?: string
  reason: DisputeReason
  message?: string
  symmetricKeyEncrypted: string
}

export const raiseDispute = async ({
  contractId,
  email,
  reason,
  message,
  symmetricKeyEncrypted,
  timeout,
}: RaiseDisputeProps) => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/dispute`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({
      email,
      reason,
      message,
      symmetricKeyEncrypted,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'raiseDispute')
}
