import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type CancelOfferProps = RequestProps &
  CancelOfferRequest & {
    offerId: string
  }

/**
 * @description Method to get cancel offer and get refunding information
 * @param offerId offer id
 * @param satsPerByte transaction fees per byte
 * @returns FundingStatus
 */
export const cancelOffer = async ({
  offerId,
  satsPerByte,
  timeout,
}: CancelOfferProps): Promise<[CancelOfferResponse | null, APIError | null]> => {
  const data: CancelOfferRequest = {}

  if (satsPerByte) data.satsPerByte = satsPerByte

  const response = await fetch(`${API_URL}/v1/offer/${offerId}/cancel`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<CancelOfferResponse>(response, 'refundEscrow')
}
