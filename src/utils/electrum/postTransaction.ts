import { BLOCKEXPLORER } from '@env'
import fetch from '../fetch'
import { getAbortWithTimeout } from '../getAbortWithTimeout'
import { RequestProps } from '../peachAPI'
import { parseResponse } from '../peachAPI/parseResponse'
import { getPublicHeaders } from '../peachAPI/public/getPublicHeaders'

type Props = RequestProps & {
  tx: string
}

export const postTransaction = async ({
  tx,
  timeout,
  abortSignal,
}: Props): Promise<[string | null, APIError | null]> => {
  const response = await fetch(`${BLOCKEXPLORER}/tx`, {
    headers: {
      ...getPublicHeaders(),
      'Content-Type': 'text/html',
      Accept: 'text/html',
    },
    method: 'POST',
    body: tx,
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return await parseResponse<string>(response, 'postTransaction', true)
}
