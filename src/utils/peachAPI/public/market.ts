import { API_URL } from '@env'
import { error } from '../../logUtils'

/**
 * @description Method to get market price for given currency
 * @param cyrrency currency to price bitcoin in
 * @returns PeachPairInfo
 */
export const marketPrice = async (currency: Currency): Promise<[PeachPairInfo|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/market/price/BTC${currency}`, {})

  try {
    const data = await response.json()
    if (response.status !== 200) {
      error('peachAPI - marketPrice', {
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

    error('peachAPI - marketPrice', e)


    return [null, { error: err }]
  }
}