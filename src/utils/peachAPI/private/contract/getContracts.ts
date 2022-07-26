import fetch from '../../../fetch'
import { API_URL } from '@env'
import { parseResponse } from '../..'
import { getAccessToken } from '../user'

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

  const parsedResponse = await parseResponse<GetContractsResponse>(response, 'getContract')

  if (parsedResponse[0]) {
    parsedResponse[0] = parsedResponse[0].map(contract => {
      contract.creationDate = new Date(contract.creationDate)
      contract.buyer.creationDate = new Date(contract.buyer.creationDate)
      contract.seller.creationDate = new Date(contract.seller.creationDate)

      if (contract.kycResponseDate) contract.kycResponseDate = new Date(contract.kycResponseDate)
      if (contract.paymentMade) contract.paymentMade = new Date(contract.paymentMade)
      if (contract.paymentConfirmed) contract.paymentConfirmed = new Date(contract.paymentConfirmed)

      return contract
    })
  }

  return parsedResponse
}