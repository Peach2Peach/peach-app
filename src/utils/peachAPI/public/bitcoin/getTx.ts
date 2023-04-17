import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

type GetTxProps = RequestProps & {
  txId: string
}

export const getTx = async ({
  txId,
  timeout,
  abortSignal,
}: GetTxProps): Promise<[GetTxResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/tx/${txId}`, {
    headers: getPublicHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return await parseResponse<GetTxResponse>(response, 'postTx')
}
