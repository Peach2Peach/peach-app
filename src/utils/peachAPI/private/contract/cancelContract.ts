import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

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
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      satsPerByte,
    }),
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<CancelContractResponse>(response, 'cancelContract')
}
