import { API_URL } from '@env'
import { parseResponse } from '../..'
import fetch from '../../../fetch'
import { getAccessToken } from '../user'

type PatchOfferProps = {
  offerId: Offer['id'],
  returnAddress?: string,
  tx?: string,
}

/**
 * @description Method to post return address update
 * @param offerId offer id
 * @param returnAddress return address
 * @returns FundingStatus
 */
export const patchOffer = async ({
  offerId,
  returnAddress,
  tx,
}: PatchOfferProps): Promise<[APISuccess|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify({
      returnAddress,
      tx,
    })
  })

  return await parseResponse<APISuccess>(response, 'createEscrow')
}