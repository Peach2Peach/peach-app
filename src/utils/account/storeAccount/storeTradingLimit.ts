import { info } from '../../log/info'
import { accountStorage } from '../accountStorage'

export const storeTradingLimit = (tradingLimit: Account['tradingLimit']) => {
  info('storeTradingLimit - Storing trading limit')

  accountStorage.setMap('tradingLimit', tradingLimit)
}
