import { API_URL } from '@env'

/**
 * @description Method to get market price for given currency
 * @param cyrrency currency to price bitcoin in
 * @returns PeachPairInfo
 */
export const marketPrice = async (currency: Currency): Promise<[PeachPairInfo|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/market/price/BTC${currency}`, {})

  try {
    return [await response.json(), null]
  } catch (e) {
    let error = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      error = e.toUpperCase()
    } else if (e instanceof Error) {
      error = e.message
    }

    return [null, { error }]
  }
}