import { defaultAccount } from '..'
import { readFile } from '../../file'
import { error } from '../../log'
import { parseError } from '../../system'

/**
 * @deprecated
 */
export const loadTradingLimitFromFileSystem = async (password: string): Promise<LegacyAccount['tradingLimit']> => {
  try {
    const tradingLimit = await readFile('/peach-account-tradingLimit.json', password)
    return JSON.parse(tradingLimit)
  } catch (e) {
    error('Could not load trading limit', parseError(e))
    return defaultAccount.tradingLimit
  }
}
