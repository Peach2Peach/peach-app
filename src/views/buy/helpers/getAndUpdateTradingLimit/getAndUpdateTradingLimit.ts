import { updateTradingLimit } from '../../../../utils/account'
import { getTradingLimit } from '../../../../utils/peachAPI'

export const getAndUpdateTradingLimit = () =>
  getTradingLimit({}).then(([tradingLimit]) => {
    if (tradingLimit) {
      updateTradingLimit(tradingLimit)
    }
  })
