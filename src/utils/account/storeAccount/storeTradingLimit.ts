import { info } from '../../log'
import { accountStorage } from '../accountStorage'

export const storeTradingLimit = async (tradingLimit: Account['tradingLimit']) => {
  info('Storing trading limit')

  accountStorage.setMap('tradingLimit', tradingLimit)
}
