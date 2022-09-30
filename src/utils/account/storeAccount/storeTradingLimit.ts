import { writeFile } from '../../file'
import { info } from '../../log'

/**
 * @description Method to save account trading limit
 * @param tradingLimit trading limit
 * @param password secret
 * @returns promise resolving to encrypted trading limit
 */
export const storeTradingLimit = async (tradingLimit: Account['tradingLimit'], password: string): Promise<void> => {
  info('Storing trading limit')

  await writeFile('/peach-account-tradingLimit.json', JSON.stringify(tradingLimit), password)
}
