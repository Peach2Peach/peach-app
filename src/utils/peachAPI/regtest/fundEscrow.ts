import { API_URL } from '@env'
import { parseResponse } from '..'
import fetch from '../../fetch'

/**
 * @description Method to fund an offer on regtest
 * @param offerId offer id
 * @returns FundEscrowResponse
 */
export const fundEscrow = async (offerId: Offer['id']): Promise<[FundEscrowResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/regtest/offer/${offerId}/fundEscrow`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<FundEscrowResponse>(response, 'fundEscrow')
}