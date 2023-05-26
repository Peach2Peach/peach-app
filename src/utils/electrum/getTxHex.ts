import { BLOCKEXPLORER } from '@env'
import { getAbortWithTimeout } from '../getAbortWithTimeout'
import { RequestProps } from '../peachAPI'
import { parseResponse } from '../peachAPI/parseResponse'
import { getPublicHeaders } from '../peachAPI/public/getPublicHeaders'
import fetch from '../fetch'

type Props = RequestProps & {
  txId: string
}

export const getTxHex = async ({ txId, timeout, abortSignal }: Props): Promise<[string | null, APIError | null]> => {
  const response = await fetch(`${BLOCKEXPLORER}/tx/${txId}/hex`, {
    headers: {
      ...getPublicHeaders(),
      Accept: 'text/html',
      'Content-Type': 'text/html',
    },
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return await parseResponse<string>(response, 'getTxHex', true)
}
