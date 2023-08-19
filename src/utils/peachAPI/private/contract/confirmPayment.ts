import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type ConfirmPaymentProps = RequestProps & {
  contractId: Contract['id']
  releaseTransaction?: string
  batchReleasePsbt?: string
}

export const confirmPayment = async ({
  contractId,
  releaseTransaction,
  batchReleasePsbt,
  timeout,
}: ConfirmPaymentProps) => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/payment/confirm`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({
      releaseTransaction,
      batchReleasePsbt,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<ConfirmPaymentResponse>(response, 'confirmPayment')
}
