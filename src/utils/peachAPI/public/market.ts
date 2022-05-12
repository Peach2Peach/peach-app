import { API_URL } from '@env'
import { parseResponse } from '..'
import fetch from '../../fetch'

/**
 * @description Method to get market prices
 * @returns Pricebook
 */
export const marketPrices = async (): Promise<[Pricebook|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/market/prices`, {})
  return await parseResponse<Pricebook>(response, 'marketPrices')
}

/**
 * @description Method to get market price for given currency
 * @param cyrrency currency to price bitcoin in
 * @returns PeachPairInfo
 */
export const marketPrice = async (currency: Currency): Promise<[PeachPairInfo|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/market/price/BTC${currency}`, {})
  return await parseResponse<PeachPairInfo>(response, 'marketPrice')
}