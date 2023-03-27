import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

type PostTxProps = RequestProps & {
  tx: string
}

export const postTx = async ({
  tx,
  timeout,
  abortSignal,
}: PostTxProps): Promise<[PostTxResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/tx`, {
    headers: getPublicHeaders(),
    method: 'POST',
    body: JSON.stringify({
      tx,
    }),
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return await parseResponse<PostTxResponse>(response, 'postTx')
}
