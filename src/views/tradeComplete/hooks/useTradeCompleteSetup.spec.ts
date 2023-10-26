import { contract } from '../../../../tests/unit/data/contractData'

const useRouteMock = jest.fn().mockReturnValue({
  params: { contract },
})
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const logTradeCompletedMock = jest.fn()
jest.mock('../../../utils/analytics', () => ({
  logTradeCompleted: (...args: unknown[]) => logTradeCompletedMock(...args),
}))

describe('useTradeCompleteSetup', () => {
  // it('logs trade completed analytics once', () => {
  //   const { rerender } = renderHook(useTradeCompleteSetup)
  //   rerender({})
  //   expect(logTradeCompletedMock).toHaveBeenCalledWith(contract)
  //   expect(logTradeCompletedMock).toHaveBeenCalledTimes(1)
  // })
  // it('saves and updates contract', () => {
  //   const now = new Date()
  //   const contractUpdate = { ...contract, paymentConfirmed: now }
  //   const { result } = renderHook(useTradeCompleteSetup)
  //   act(() => result.current.saveAndUpdate(contractUpdate))
  //   expect(result.current.contract).toEqual(contractUpdate)
  // })
})
