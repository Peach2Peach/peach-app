import { info } from '../../log'
import { accountStorage } from '../../storage'

export const storeTradingLimit = async (tradingLimit: Account['tradingLimit']) => {
  info('storeTradingLimit - Storing trading limit')

  accountStorage.setMap('tradingLimit', tradingLimit)
}
