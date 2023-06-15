import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type RejectContractCancelationProps = RequestProps & {
  contractId: Contract['id']
}

export const rejectContractCancelation = async ({ contractId, timeout }: RejectContractCancelationProps) => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/cancel/reject`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'rejectContractCancelation')
}
