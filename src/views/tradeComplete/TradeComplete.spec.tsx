import { render } from 'test-utils'
import { contract } from '../../../tests/unit/data/contractData'
import { TradeComplete } from './TradeComplete'

const useRouteMock = jest.fn().mockReturnValue({
  params: { contract },
})
jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const logTradeCompletedMock = jest.fn()
jest.mock('../../utils/analytics', () => ({
  logTradeCompleted: (...args: unknown[]) => logTradeCompletedMock(...args),
}))

describe('TradeComplete', () => {
  it('logs trade completed analytics once', () => {
    const { rerender } = render(<TradeComplete />)
    rerender(<TradeComplete />)

    expect(logTradeCompletedMock).toHaveBeenCalledWith(contract)
    expect(logTradeCompletedMock).toHaveBeenCalledTimes(1)
  })
})
