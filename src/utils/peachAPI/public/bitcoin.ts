import { API_URL } from '@env'
import { RequestProps } from '..'
import fetch, { getAbortWithTimeout } from '../../fetch'
import { parseResponse } from '../parseResponse'

type GetTxProps = RequestProps & {
  txId: string
}

/**
 * @description Method get transaction information
 * @param txId transaction id
 * @returns GetTxResponse
 */
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

type PostTxProps = RequestProps & {
  tx: string
}

/**
 * @description Method to post transaction
 * @param tx offer id
 * @returns PostTxResponse
 */
export const postTx = async ({ tx, timeout }: PostTxProps): Promise<[PostTxResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/tx`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      tx,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<PostTxResponse>(response, 'postTx')
}
