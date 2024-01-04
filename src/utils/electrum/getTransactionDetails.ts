import { ESPLORA_URL } from '@env'
import fetch from '../fetch'
import { getPublicHeaders } from '../peachAPI/getPublicHeaders'
import { parseResponse } from '../peachAPI/parseResponse'

type Props = {
  txId: string
}

export const getTransactionDetails = async ({ txId }: Props) => {
  const response = await fetch(`${ESPLORA_URL}/tx/${txId}`, {
    headers: getPublicHeaders(),
    method: 'GET',
  })

  return parseResponse<Transaction>(response, 'getTransactionDetails', false)
}
