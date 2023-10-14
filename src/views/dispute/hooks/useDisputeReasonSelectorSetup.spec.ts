import { renderHook } from 'test-utils'
import { account1 } from '../../../../tests/unit/data/accountData'
import { contract } from '../../../../tests/unit/data/contractData'
import { apiSuccess, unauthorizedError } from '../../../../tests/unit/data/peachAPIData'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/CustomWrapper'
import { headerState } from '../../../../tests/unit/helpers/NavigationWrapper'
import { setAccount } from '../../../utils/account'
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

const navigateMock = jest.fn()
const goBackMock = jest.fn()
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
    goBack: goBackMock,
  }),
}))

const useHeaderSetupMock = jest.fn()
jest.mock('../../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: (...args: unknown[]) => useHeaderSetupMock(...args),
}))

const getContractMock = jest.fn().mockReturnValue(contract)
jest.mock('../../../utils/contract/getContract', () => ({
  getContract: (...args: unknown[]) => getContractMock(...args),
}))

const submitRaiseDisputeMock = jest.fn().mockResolvedValue([apiSuccess, null])
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

// eslint-disable-next-line max-lines-per-function
describe('useDisputeReasonSelectorSetup', () => {
  it('returns default values correctly for seller', () => {
    setAccount({ ...account1, publicKey: contract.seller.id })
    const { result } = renderHook(useDisputeReasonSelectorSetup, {
      initialProps: contract,
      wrapper: NavigationAndQueryClientWrapper,
    })

    expect(result.current.availableReasons).toEqual(disputeReasons.seller)
    expect(result.current.setReason).toBeInstanceOf(Function)
  })
  it('returns default values correctly for buyer', () => {
    setAccount({ ...account1, publicKey: contract.buyer.id })
    const { result } = renderHook(useDisputeReasonSelectorSetup, {
      initialProps: contract,
      wrapper: NavigationAndQueryClientWrapper,
    })

    expect(result.current.availableReasons).toEqual(disputeReasons.buyer)
  })
  it('sets up the header correctly', () => {
    renderHook(useDisputeReasonSelectorSetup, { initialProps: contract, wrapper: NavigationAndQueryClientWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('sets reason and navigate to dispute form if reason is noPayment.buyer', async () => {
    const reason = 'noPayment.buyer'
    const { result } = renderHook(useDisputeReasonSelectorSetup, {
      initialProps: contract,
      wrapper: NavigationAndQueryClientWrapper,
    })
    await result.current.setReason(reason)
    expect(navigateMock).toHaveBeenCalledWith('disputeForm', { contractId: contract.id, reason })
    expect(showDisputeRaisedPopupMock).not.toHaveBeenCalled()
  })
  it('sets reason and navigate to dispute form if reason is noPayment.seller', async () => {
    const reason = 'noPayment.seller'
    const { result } = renderHook(useDisputeReasonSelectorSetup, {
      initialProps: contract,
      wrapper: NavigationAndQueryClientWrapper,
    })
    await result.current.setReason(reason)
    expect(navigateMock).toHaveBeenCalledWith('disputeForm', { contractId: contract.id, reason })
    expect(showDisputeRaisedPopupMock).not.toHaveBeenCalled()
  })
  it('sets reason and submits dispute request if reason is any other', async () => {
    const reason = 'abusive'
    const { result } = renderHook(useDisputeReasonSelectorSetup, {
      initialProps: contract,
      wrapper: NavigationAndQueryClientWrapper,
    })
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
    const { result } = renderHook(useDisputeReasonSelectorSetup, {
      initialProps: contract,
      wrapper: NavigationAndQueryClientWrapper,
    })
    await result.current.setReason(reason)
    expect(showErrorBannerMock).toHaveBeenCalledWith(unauthorizedError.error)
    expect(showDisputeRaisedPopupMock).not.toHaveBeenCalled()
  })
})
