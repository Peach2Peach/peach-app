import fetch, { getAbortSignal } from '../../../fetch'
import { API_URL } from '@env'
import { parseResponse, RequestProps } from '../..'
import { getAccessToken } from '../user'

type RaiseDisputeProps = RequestProps & {
  contractId: Contract['id']
  email?: string
  reason: DisputeReason
  message: string
  symmetricKeyEncrypted: string
}

/**
 * @description Method to raise a dispute for a contract
 * @param contractId contract id
 * @param reason reason
 * @param message message
 * @param symmetricKey symmetricKey to encrypt/decrypt messages
 */
export const raiseDispute = async ({
  contractId,
  email,
  reason,
  message,
  symmetricKeyEncrypted,
  timeout,
}: RaiseDisputeProps): Promise<[APISuccess | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/dispute`, {
    headers: {
      Authorization: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      email,
      reason,
      message,
      symmetricKeyEncrypted,
    }),
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<APISuccess>(response, 'raiseDispute')
}
