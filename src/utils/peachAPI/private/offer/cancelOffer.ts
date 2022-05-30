import { API_URL } from '@env'
import { parseResponse } from '../..'
import fetch from '../../../fetch'
import { getAccessToken } from '../user'

type CancelOfferProps = CancelOfferRequest & {
  offerId: string,
}

/**
 * @description Method to get cancel offer and get refunding information
 * @param offerId offer id
 * @param satsPerByte transaction fees per byte
 * @returns FundingStatus
 */
export const cancelOffer = async ({
  offerId,
  satsPerByte
}: CancelOfferProps): Promise<[CancelOfferResponse|null, APIError|null]> => {
  const data: CancelOfferRequest = {}

  if (satsPerByte) data.satsPerByte = satsPerByte

  const response = await fetch(
    `${API_URL}/v1/offer/${offerId}/cancel`,
    {
      headers: {
        Authorization: await getAccessToken(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data),
    }
  )

  return await parseResponse<CancelOfferResponse>(response, 'refundEscrow')
}