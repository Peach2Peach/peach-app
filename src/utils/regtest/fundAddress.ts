import { API_URL } from '@env'
import fetch from '../fetch'
import { getPublicHeaders } from '../peachAPI/getPublicHeaders'
import { parseResponse } from '../peachAPI/parseResponse'

type Props = {
  address: string
  amount: number
}
export const fundAddress = async ({ address, amount }: Props) => {
  const response = await fetch(`${API_URL}/v1/regtest/fundAddress`, {
    headers: getPublicHeaders(),
    method: 'POST',
    body: JSON.stringify({
      address,
      amount,
    }),
  })

  return parseResponse<GenerateBlockResponse>(response, 'fundAddress')
}
