import { API_URL } from '@env'
import { parseResponse, RequestProps } from '..'
import fetch, { getAbortSignal } from '../../fetch'

type GetTxProps = RequestProps & {
  txId: string
}

/**
 * @description Method get transaction information
 * @param txId transaction id
 * @returns GetTxResponse
 */
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
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<PostTxResponse>(response, 'postTx')
}
