import { ESPLORA_URL } from '@env'
import fetch from '../fetch'
import { getAbortWithTimeout } from '../getAbortWithTimeout'
import { RequestProps } from '../peachAPI'
import { parseResponse } from '../peachAPI/parseResponse'
import { getPublicHeaders } from '../peachAPI/public/getPublicHeaders'

type Props = RequestProps & {
  txId: string
}

export const getTransactionDetails = async ({ txId, timeout, abortSignal }: Props) => {
  const response = await fetch(`${ESPLORA_URL}/tx/${txId}`, {
    headers: getPublicHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return parseResponse<Transaction>(response, 'getTransactionDetails', false)
}
