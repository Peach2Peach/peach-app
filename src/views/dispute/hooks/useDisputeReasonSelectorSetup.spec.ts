import { renderHook } from 'test-utils'
import { contract } from '../../../../peach-api/src/testData/contract'
import { account1 } from '../../../../tests/unit/data/accountData'
import { unauthorizedError } from '../../../../tests/unit/data/peachAPIData'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { setAccount } from '../../../utils/account/account'
import { disputeReasons } from './disputeReasons'
import { useDisputeReasonSelectorSetup } from './useDisputeReasonSelectorSetup'

const useRouteMock = jest.fn().mockReturnValue({
  params: {
    contractId: contract.id,
  },
})
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const submitRaiseDisputeMock = jest.fn().mockResolvedValue([true, null])
jest.mock('../utils/submitRaiseDispute', () => ({
  submitRaiseDispute: (...args: unknown[]) => submitRaiseDisputeMock(...args),
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))
const showDisputeRaisedPopupMock = jest.fn()
jest.mock('../../../popups/dispute/hooks/useDisputeRaisedSuccess', () => ({
  useDisputeRaisedSuccess: () => showDisputeRaisedPopupMock,
}))

describe('useDisputeReasonSelectorSetup', () => {
  it('returns default values correctly for seller', () => {
    setAccount({ ...account1, publicKey: contract.seller.id })
    const { result } = renderHook(useDisputeReasonSelectorSetup, { initialProps: contract })

    expect(result.current.availableReasons).toEqual(disputeReasons.seller)
    expect(result.current.setReason).toBeInstanceOf(Function)
  })
  it('returns default values correctly for buyer', () => {
    setAccount({ ...account1, publicKey: contract.buyer.id })
    const { result } = renderHook(useDisputeReasonSelectorSetup, { initialProps: contract })

    expect(result.current.availableReasons).toEqual(disputeReasons.buyer)
  })
  it('sets reason and navigate to dispute form if reason is noPayment.buyer', async () => {
    const reason = 'noPayment.buyer'
    const { result } = renderHook(useDisputeReasonSelectorSetup, { initialProps: contract })
    await result.current.setReason(reason)
    expect(navigateMock).toHaveBeenCalledWith('disputeForm', { contractId: contract.id, reason })
    expect(showDisputeRaisedPopupMock).not.toHaveBeenCalled()
  })
  it('sets reason and navigate to dispute form if reason is noPayment.seller', async () => {
    const reason = 'noPayment.seller'
    const { result } = renderHook(useDisputeReasonSelectorSetup, { initialProps: contract })
    await result.current.setReason(reason)
    expect(navigateMock).toHaveBeenCalledWith('disputeForm', { contractId: contract.id, reason })
    expect(showDisputeRaisedPopupMock).not.toHaveBeenCalled()
  })
  it('sets reason and submits dispute request if reason is any other', async () => {
    const reason = 'abusive'
    const { result } = renderHook(useDisputeReasonSelectorSetup, { initialProps: contract })
    await result.current.setReason(reason)
    expect(submitRaiseDisputeMock).toHaveBeenCalledWith({
      contract,
      reason,
    })
    expect(showDisputeRaisedPopupMock).toHaveBeenCalled()
  })
  it('shows error banner if dispute request fails', async () => {
    submitRaiseDisputeMock.mockResolvedValueOnce([null, unauthorizedError])
    const reason = 'abusive'
    const { result } = renderHook(useDisputeReasonSelectorSetup, { initialProps: contract })
    await result.current.setReason(reason)
    expect(showErrorBannerMock).toHaveBeenCalledWith(unauthorizedError.error)
    expect(showDisputeRaisedPopupMock).not.toHaveBeenCalled()
  })
})
