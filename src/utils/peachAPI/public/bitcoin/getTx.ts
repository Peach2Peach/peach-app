import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'

type GetTxProps = RequestProps & {
  txId: string
}

export const getTx = async ({
  txId,
  timeout,
  abortSignal,
}: GetTxProps): Promise<[GetTxResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/tx/${txId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return await parseResponse<GetTxResponse>(response, 'postTx')
}
