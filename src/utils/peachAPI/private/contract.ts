import { API_URL } from '@env'
import { parseResponse } from '..'
import fetch from '../../fetch'
import { getAccessToken } from './user'

type GetContractProps = {
  contractId: string,
}

/**
 * @description Method to get contract
 * @param contractId contract id
 * @returns Contract
 */
export const getContract = async ({
  contractId,
}: GetContractProps): Promise<[GetContractResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<GetContractResponse>(response, 'getContract')
}

type ConfirmPaymentProps = {
  contractId: string,
  releaseTransaction?: string
}

/**
 * @description Method to confirm either payment made or received depending on party
 * @param contractId contract id
 * @returns Contract
 */
export const confirmPayment = async ({
  contractId,
  releaseTransaction,
}: ConfirmPaymentProps): Promise<[APISuccess|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/payment/confirm`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      releaseTransaction,
    })
  })

  return await parseResponse<APISuccess>(response, 'confirmPayment')
}