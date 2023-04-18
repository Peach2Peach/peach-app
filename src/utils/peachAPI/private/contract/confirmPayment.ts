import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type ConfirmPaymentProps = RequestProps & {
  contractId: Contract['id']
  releaseTransaction?: string
}

/**
 * @description Method to confirm either payment made or received depending on party
 * @param contractId contract id
 * @returns Contract
 */
export const confirmPayment = async ({
  contractId,
  releaseTransaction,
  timeout,
}: ConfirmPaymentProps): Promise<[ConfirmPaymentResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/payment/confirm`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({
      releaseTransaction,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<ConfirmPaymentResponse>(response, 'confirmPayment')
}
