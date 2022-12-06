import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

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
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      releaseTransaction,
    }),
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<ConfirmPaymentResponse>(response, 'confirmPayment')
}
