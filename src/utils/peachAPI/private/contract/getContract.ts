import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type GetContractProps = RequestProps & {
  contractId: Contract['id']
}

/**
 * @description Method to get contract
 * @param contractId contract id
 * @returns Contract
 */
export const getContract = async ({
  contractId,
  timeout,
  abortSignal,
}: GetContractProps): Promise<[GetContractResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  const parsedResponse = await parseResponse<GetContractResponse>(response, 'getContract')

  if (parsedResponse[0]) {
    parsedResponse[0].creationDate = new Date(parsedResponse[0].creationDate)
    if (parsedResponse[0].kycResponseDate) {
      parsedResponse[0].kycResponseDate = new Date(parsedResponse[0].kycResponseDate)
    }
    if (parsedResponse[0].paymentMade) {
      parsedResponse[0].paymentMade = new Date(parsedResponse[0].paymentMade)
    }
    if (parsedResponse[0].paymentExpectedBy) {
      parsedResponse[0].paymentExpectedBy = new Date(parsedResponse[0].paymentExpectedBy)
    }
    if (parsedResponse[0].paymentConfirmed) {
      parsedResponse[0].paymentConfirmed = new Date(parsedResponse[0].paymentConfirmed)
    }
    if (parsedResponse[0].disputeDate) {
      parsedResponse[0].disputeDate = new Date(parsedResponse[0].disputeDate)
    }
    if (parsedResponse[0].disputeResolvedDate) {
      parsedResponse[0].disputeResolvedDate = new Date(parsedResponse[0].disputeResolvedDate)
    }
  }

  return parsedResponse
}
