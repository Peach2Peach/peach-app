import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type PostChatProps = RequestProps & {
  contractId: Contract['id']
  message: string
  signature: string
}

export const postChat = async ({ contractId, message, signature, timeout }: PostChatProps) => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/chat`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({
      message,
      signature,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'postChat')
}
