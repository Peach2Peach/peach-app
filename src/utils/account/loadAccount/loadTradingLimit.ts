import { defaultAccount } from '../'
import { readFile } from '../../file'
import { error } from '../../log'
import { parseError } from '../../system'

/**
 * @description Method to load trading limits
 * @param password password
 * @returns Promise resolving to trading limits
 */
export const loadTradingLimit = async (password: string): Promise<Account['tradingLimit']> => {
  try {
    const tradingLimit = await readFile('/peach-account-tradingLimit.json', password)
    return JSON.parse(tradingLimit)
  } catch (e) {
    error('Could not load trading limit', parseError(e))
    return defaultAccount.tradingLimit
  }
}
