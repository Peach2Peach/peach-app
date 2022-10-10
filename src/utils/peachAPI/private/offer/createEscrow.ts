import { API_URL } from '@env'
import { parseResponse, RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { getAccessToken } from '../user'

type CreateEscrowProps = RequestProps & {
  offerId: string
  publicKey: string
}

/**
 * @description Method to create escrow for offer
 * @param offerId offer id
 * @param publicKey Seller public key needed for verifying seller signature for release transaction
 * @returns FundingStatus
 */
export const createEscrow = async ({
  offerId,
  publicKey,
  timeout,
}: CreateEscrowProps): Promise<[CreateEscrowResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: {
      Authorization: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      publicKey,
    }),
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<CreateEscrowResponse>(response, 'createEscrow')
}
