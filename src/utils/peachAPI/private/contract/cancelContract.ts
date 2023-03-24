import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type CancelContractProps = RequestProps & {
  contractId: Contract['id']
  satsPerByte?: number
}

/**
 * @description Method to cancel contract
 * @param contractId contract id
 * @param [satsPerByte] network fees in sats per byte
 * @returns scuess or error
 */
export const cancelContract = async ({
  contractId,
  satsPerByte,
  timeout,
}: CancelContractProps): Promise<[CancelContractResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/cancel`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({
      satsPerByte,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<CancelContractResponse>(response, 'cancelContract')
}
