import { act, renderHook } from 'test-utils'
import { account1 } from '../../../../tests/unit/data/accountData'
import { contract } from '../../../../tests/unit/data/contractData'
import { setAccount } from '../../../utils/account'
import { useTradeCompleteSetup } from './useTradeCompleteSetup'

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

const saveContractMock = jest.fn()
jest.mock('../../../utils/contract/saveContract', () => ({
  saveContract: (...args: unknown[]) => saveContractMock(...args),
}))

describe('useTradeCompleteSetup', () => {
  it('returns default values correctly as buyer', () => {
    setAccount({ ...account1, publicKey: contract.buyer.id })
    const { result } = renderHook(useTradeCompleteSetup)

    expect(result.current).toEqual({
      view: 'buyer',
      vote: undefined,
      setVote: expect.any(Function),
      contract,
      saveAndUpdate: expect.any(Function),
    })
  })
  it('returns default values correctly as seller', () => {
    setAccount({ ...account1, publicKey: contract.seller.id })
    const { result } = renderHook(useTradeCompleteSetup)

    expect(result.current).toEqual({
      view: 'seller',
      vote: undefined,
      setVote: expect.any(Function),
      contract,
      saveAndUpdate: expect.any(Function),
    })
  })
  it('logs trade completed analytics once', () => {
    const { rerender } = renderHook(useTradeCompleteSetup)

    rerender({})
    expect(logTradeCompletedMock).toHaveBeenCalledWith(contract)
    expect(logTradeCompletedMock).toHaveBeenCalledTimes(1)
  })
  it('saves and updates contract', () => {
    const now = new Date()
    const contractUpdate = { ...contract, paymentConfirmed: now }
    const { result } = renderHook(useTradeCompleteSetup)

    act(() => result.current.saveAndUpdate(contractUpdate))
    expect(result.current.contract).toEqual(contractUpdate)
    expect(saveContractMock).toHaveBeenCalledWith(contractUpdate)
  })
})
