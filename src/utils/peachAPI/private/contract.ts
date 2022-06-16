import { API_URL } from '@env'
import { parseResponse } from '..'
import fetch from '../../fetch'
import { getAccessToken } from './user'

type GetContractProps = {
  contractId: Contract['id'],
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


/**
 * @description Method to get contracts
 * @returns Contracts
 */
export const getContracts = async (): Promise<[GetContractsResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contracts`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<GetContractsResponse>(response, 'getContract')
}

type ConfirmPaymentProps = {
  contractId: Contract['id'],
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
}: ConfirmPaymentProps): Promise<[ConfirmPaymentResponse|null, APIError|null]> => {
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

  return await parseResponse<ConfirmPaymentResponse>(response, 'confirmPayment')
}

type RateUserProps = {
  contractId: Contract['id'],
  rating: 1 | -1,
  signature: string
}

/**
 * @description Method to confirm either payment made or received depending on party
 * @param contractId contract id
 * @returns Contract
 */
export const rateUser = async ({
  contractId,
  rating,
  signature,
}: RateUserProps): Promise<[APISuccess|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/user/rate`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      rating,
      signature,
    })
  })

  return await parseResponse<APISuccess>(response, 'rateUser')
}


type GetChatProps = {
  contractId: Contract['id'],
  page?: number
}

/**
 * @description Method to get contract chat
 * @param contractId contract id
 * @param [page] page
 * @returns Chat log
 */
export const getChat = async ({
  contractId,
  page = 0
}: GetChatProps): Promise<[GetChatResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/chat?page=${page}`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<GetChatResponse>(response, 'getChat')
}


type PostChatProps = {
  contractId: Contract['id'],
  message: string,
  signature: string,
}

/**
 * @description Method to get contract chat
 * @param contractId contract id
 * @param message encrypted message
 * @param signature signature of message
 * @returns Chat log
 */
export const postChat = async ({
  contractId,
  message,
  signature,
}: PostChatProps): Promise<[APISuccess|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/chat`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      message,
      signature,
    })
  })

  return await parseResponse<APISuccess>(response, 'postChat')
}


type RaiseDisputeProps = {
  contractId: Contract['id'],
  reason: DisputeReason,
  message: string,
  symmetricKeyEncrypted: string
}

/**
 * @description Method to raise a dispute for a contract
 * @param contractId contract id
 * @param reason reason
 * @param message message
 * @param symmetricKey symmetricKey to encrypt/decrypt messages
 */
export const raiseDispute = async ({
  contractId,
  reason,
  message,
  symmetricKeyEncrypted,
}: RaiseDisputeProps): Promise<[APISuccess|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/dispute`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      reason,
      message,
      symmetricKeyEncrypted,
    })
  })

  return await parseResponse<APISuccess>(response, 'raiseDispute')
}


type AcknowledgeDisputeProps = {
  contractId: Contract['id'],
}

/**
 * @description Method to acknowlege a dispute for a contract
 * @param contractId contract id
 */
export const acknowledgeDispute = async ({
  contractId,
}: AcknowledgeDisputeProps): Promise<[APISuccess|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/dispute/acknowledge`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })

  return await parseResponse<APISuccess>(response, 'acknowledgeDispute')
}
