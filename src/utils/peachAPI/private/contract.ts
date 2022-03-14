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
}: GetContractProps): Promise<[Contract|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<Contract>(response, 'getContract')
}


type PostPaymentDataProps = {
  contractId: string,
  paymentData: string,
  pgpSignature: string,
}

/**
 * @description Method to post encrypted payment data
 * @param contractId contract id
 * @param paymentData encrypted payment data
 * @param pgpSignature pgp signature of encrypted data
 * @returns Contract
 */
export const postPaymentData = async ({
  contractId,
  paymentData,
  pgpSignature,
}: PostPaymentDataProps): Promise<[APISuccess|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/payment`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      paymentData,
      pgpSignature,
    })
  })

  return await parseResponse<APISuccess>(response, 'postPaymentData')
}

type ConfirmPaymentProps = {
  contractId: string,
}

/**
 * @description Method to confirm either payment made or received depending on party
 * @param contractId contract id
 * @returns Contract
 */
export const confirmPayment = async ({
  contractId,
}: ConfirmPaymentProps): Promise<[APISuccess|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/payment/confirm`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })

  return await parseResponse<APISuccess>(response, 'confirmPayment')
}