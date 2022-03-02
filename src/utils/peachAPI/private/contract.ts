import { API_URL } from '@env'
import { error } from '../../logUtils'
import { getAccessToken } from './auth'

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

  try {
    const data = await response.json()
    if (response.status !== 200) {
      error('peachAPI - getContract', {
        status: response.status,
        data
      })

      return [null, data]
    }
    return [data, null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - getContract', e)


    return [null, { error: err }]
  }
}