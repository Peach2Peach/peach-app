import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

type PostTxProps = RequestProps & {
  tx: string
}

export const postTx = async ({ tx, timeout, abortSignal }: PostTxProps) => {
  const response = await fetch(`${API_URL}/v1/tx`, {
    headers: getPublicHeaders(),
    method: 'POST',
    body: JSON.stringify({
      tx,
    }),
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return parseResponse<PostTxResponse>(response, 'postTx')
}
