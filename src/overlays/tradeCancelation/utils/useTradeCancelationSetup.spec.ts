import { contract } from './../../../../tests/unit/data/contractData'
import { renderHook, act } from '@testing-library/react-hooks'
import { useTradeCancelationSetup } from './useTradeCancelationSetup'

const useOverlayContextMock = jest.fn()
jest.mock('../../../contexts/overlay', () => ({
  useOverlayContext: () => useOverlayContextMock(),
}))

const navigateMock = jest.fn()
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    replace: () => navigateMock(),
  }),
}))

describe('useTradeCancelationSetup', () => {
  const updateOverlayMock = jest.fn()

  beforeEach(() => {
    useOverlayContextMock.mockReturnValue([, updateOverlayMock])
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('cancels the trade', async () => {
    const confirmContractCancelation = jest.fn().mockResolvedValue([true, null])
    const saveContract = jest.fn()
    const updateOverlay = jest.fn()
    const showError = jest.fn()
    const showLoadingOverlay = jest.fn()

    const { result, waitForNextUpdate } = renderHook(() => useTradeCancelationSetup())
    const { cancelTrade } = result.current

    await act(async () => {
      await cancelTrade(contract)
      await waitForNextUpdate()
    })

    expect(showLoadingOverlay).toHaveBeenCalledWith('trade cancelation')
    expect(confirmContractCancelation).toHaveBeenCalled()
    expect(saveContract).toHaveBeenCalledWith({ ...contract, canceled: true, cancelationRequested: false })
    expect(updateOverlay).toHaveBeenCalledWith({ title: 'Trade canceled', visible: true, level: 'APP' })
    expect(navigateMock).toHaveBeenCalledWith('contract', {
      contractId: expect.any(String),
      contract: { ...contract, canceled: true, cancelationRequested: false },
    })
    expect(showError).not.toHaveBeenCalled()
  })
})
