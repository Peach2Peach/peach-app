import { contract } from '../../../tests/unit/data/contractData'
import { logTradeCompleted } from './logTradeCompleted'

const logEventMock = jest.fn()
jest.mock('@react-native-firebase/analytics', () => () => ({
  logEvent: (...args: any[]) => logEventMock(...args),
}))

describe('logTradeCompleted', () => {
  it('should call analytics event', () => {
    logTradeCompleted(contract)
    expect(logEventMock).toHaveBeenCalledWith('trade_completed', {
      amount: contract.amount,
      value: contract.price,
      currency: contract.currency,
      payment_method: contract.paymentMethod,
    })
  })
})
