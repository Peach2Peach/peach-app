import { API_URL } from '@env'
import { parseResponse, RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { getAccessToken } from '../user'

type PatchOfferProps = RequestProps & {
  offerId: Offer['id']
  returnAddress?: string
  refundTx?: string
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
  refundTx,
  timeout,
}: PatchOfferProps): Promise<[APISuccess | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}`, {
    headers: {
      Authorization: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify({
      returnAddress,
      refundTx,
    }),
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<APISuccess>(response, 'patchOffer')
}
