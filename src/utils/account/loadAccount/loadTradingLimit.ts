import { defaultAccount } from '../'
import { error } from '../../log'
import { accountStorage } from '../../storage'

export const loadTradingLimit = async (): Promise<Account['tradingLimit']> => {
  const tradingLimit = accountStorage.getMap('tradingLimit')

  if (tradingLimit) return tradingLimit as Account['tradingLimit']

  error('Could not load tradingLimit')
  return defaultAccount.tradingLimit
}
