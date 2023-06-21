import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type GetContractProps = RequestProps & {
  contractId: Contract['id']
}

export const getContract = async ({ contractId, timeout, abortSignal }: GetContractProps) => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return parseResponse<GetContractResponse>(response, 'getContract')
}
