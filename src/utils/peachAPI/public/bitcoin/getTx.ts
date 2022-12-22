import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { parseResponse } from '../../parseResponse'

type GetTxProps = RequestProps & {
  txId: string
}

export const getTx = async ({ txId, timeout }: GetTxProps): Promise<[GetTxResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/tx/${txId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<GetTxResponse>(response, 'postTx')
}
