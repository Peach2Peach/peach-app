import { API_URL } from '@env'
import { parseResponse } from '../..'
import fetch from '../../../fetch'
import { getAccessToken } from '../user'

type CreateEscrowProps = {
  offerId: string,
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
  publicKey
}: CreateEscrowProps): Promise<[CreateEscrowResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      publicKey
    })
  })

  return await parseResponse<CreateEscrowResponse>(response, 'createEscrow')
}