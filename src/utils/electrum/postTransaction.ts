import { ESPLORA_URL } from '@env'
import fetch from '../fetch'
import { getPublicHeaders } from '../peachAPI/getPublicHeaders'
import { parseResponse } from '../peachAPI/parseResponse'

type Props = {
  tx: string
}

export const postTransaction = async ({ tx }: Props) => {
  const response = await fetch(`${ESPLORA_URL}/tx`, {
    headers: {
      ...getPublicHeaders(),
      'Content-Type': 'text/html',
      Accept: 'text/html',
    },
    method: 'POST',
    body: tx,
  })

  return parseResponse<string>(response, 'postTransaction', true)
}
