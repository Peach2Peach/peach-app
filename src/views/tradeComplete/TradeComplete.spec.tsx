import { render, waitFor } from 'test-utils'
import { contract } from '../../../tests/unit/data/contractData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
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

jest.useFakeTimers()

describe('TradeComplete', () => {
  it('logs trade completed analytics once', async () => {
    const { rerender } = render(<TradeComplete />)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })
    rerender(<TradeComplete />)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })

    expect(logTradeCompletedMock).toHaveBeenCalledWith(contract)
    expect(logTradeCompletedMock).toHaveBeenCalledTimes(1)
  })
})
