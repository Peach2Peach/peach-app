import { act, renderHook } from '@testing-library/react-native'
import { contract } from '../../../../tests/unit/data/contractData'
import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { useDisputeFormSetup } from './useDisputeFormSetup'
import { unauthorizedError } from '../../../../tests/unit/data/peachAPIData'

const defaultReason = 'other'
const useRouteMock = jest.fn(() => ({
  params: {
    reason: defaultReason,
    contractId: contract.id,
  },
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const navigateMock = jest.fn()
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
}))

const useHeaderSetupMock = jest.fn()
jest.mock('../../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: (...args: any[]) => useHeaderSetupMock(...args),
}))

const showErrorBannerMock = jest.fn()
const useShowErrorBannerMock = jest.fn().mockReturnValue(showErrorBannerMock)
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => useShowErrorBannerMock(),
}))

const getContractMock = jest.fn()
jest.mock('../../../utils/contract/getContract', () => ({
  getContract: () => getContractMock(),
}))

const submitRaiseDisputeMock = jest.fn()
jest.mock('../utils/submitRaiseDispute', () => ({
  submitRaiseDispute: (...args: any[]) => submitRaiseDisputeMock(...args),
}))

const disputeRaisedSuccessMock = jest.fn()
const useDisputeRaisedSuccessMock = jest.fn(
  () =>
    (...args: any[]) =>
      disputeRaisedSuccessMock(...args),
)
jest.mock('../../../popups/dispute/hooks/useDisputeRaisedSuccess', () => ({
  useDisputeRaisedSuccess: () => useDisputeRaisedSuccessMock(),
}))

// eslint-disable-next-line max-lines-per-function
describe('useDisputeFormSetup', () => {
  const email = 'test@email.com'
  const message = 'testMessage'

  const fillAllFields = (current: ReturnType<typeof useDisputeFormSetup>) =>
    act(() => {
      current.setEmail(email)
      current.setMessage(message)
    })

  const actSubmit = (current: ReturnType<typeof useDisputeFormSetup>) =>
    act(async () => {
      await current.submit()
    })

  beforeEach(() => {
    getContractMock.mockReturnValue(contract)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return the correct default values', () => {
    const { result } = renderHook(() => useDisputeFormSetup())
    expect(result.current).toStrictEqual({
      email: '',
      setEmail: expect.any(Function),
      emailErrors: expect.any(Array),
      reason: defaultReason,
      message: '',
      setMessage: expect.any(Function),
      messageErrors: expect.any(Array),
      isFormValid: false,
      submit: expect.any(Function),
      loading: false,
      showErrorBanner: showErrorBannerMock,
    })
  })
  it('sets up the header correctly', () => {
    renderHook(useDisputeFormSetup)
    expect(useHeaderSetupMock).toHaveBeenCalledWith({
      title: i18n('dispute.disputeForTrade', contractIdToHex(contract.id)),
    })
  })
  it('sets email', () => {
    const { result } = renderHook(useDisputeFormSetup)

    act(() => {
      result.current.setEmail(email)
    })

    expect(result.current.email).toEqual(email)
    expect(result.current.emailErrors).toHaveLength(0)
  })
  it('sets message', () => {
    const { result } = renderHook(useDisputeFormSetup)

    act(() => {
      result.current.setMessage(message)
    })

    expect(result.current.message).toEqual(message)
    expect(result.current.messageErrors).toHaveLength(0)
  })
  it('validates form', () => {
    const { result } = renderHook(useDisputeFormSetup)

    expect(result.current.isFormValid).toBeFalsy()
    fillAllFields(result.current)
    expect(result.current.isFormValid).toBeTruthy()
  })

  it('does not submit report if conditions are not met', async () => {
    const { result } = renderHook(useDisputeFormSetup)

    await actSubmit(result.current)
    expect(submitRaiseDisputeMock).not.toHaveBeenCalled()

    getContractMock.mockReturnValue({ ...contract, symmetricKey: undefined })
    await actSubmit(result.current)
    expect(submitRaiseDisputeMock).not.toHaveBeenCalled()

    fillAllFields(result.current)
    await actSubmit(result.current)

    expect(submitRaiseDisputeMock).not.toHaveBeenCalled()
  })
  it('submits report and navigates to contract chat on success', async () => {
    submitRaiseDisputeMock.mockResolvedValueOnce([true, null])
    const { result } = renderHook(useDisputeFormSetup)

    fillAllFields(result.current)
    await actSubmit(result.current)

    expect(submitRaiseDisputeMock).toHaveBeenCalledWith(
      contract,
      defaultReason,
      result.current.email,
      result.current.message,
    )
    expect(disputeRaisedSuccessMock).toHaveBeenCalledWith('buyer')
    expect(navigateMock).toHaveBeenCalledWith('contractChat', { contractId: contract.id })
  })
  it('shows error if raising dispute was not successful', async () => {
    submitRaiseDisputeMock.mockResolvedValueOnce([false, unauthorizedError])
    const { result } = renderHook(useDisputeFormSetup)
    fillAllFields(result.current)
    await actSubmit(result.current)

    expect(showErrorBannerMock).toHaveBeenCalledWith(unauthorizedError.error)
  })
})
