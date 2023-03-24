import { contract } from './../../../tests/unit/data/contractData'
import { useConfirmTradeCancelationOverlay } from './useConfirmTradeCancelationOverlay'
import { act, renderHook } from '@testing-library/react-hooks'

const useOverlayContextMock = jest.fn()
jest.mock('../../contexts/overlay', () => ({
  useOverlayContext: () => useOverlayContextMock(),
}))
const useTradeCancelationSetupMock = jest.fn()
jest.mock('./utils/useTradeCancelationSetup', () => ({
  useTradeCancelationSetup: () => useTradeCancelationSetupMock(),
}))

describe('useConfirmTradeCancelationOverlay', () => {
  const updateOverlayMock = jest.fn()
  const cancelTradeMock = jest.fn()
  const continueTradeMock = jest.fn()
  beforeEach(() => {
    useOverlayContextMock.mockReturnValue([, updateOverlayMock])
    useTradeCancelationSetupMock.mockReturnValue({ cancelTradeMock, continueTradeMock })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should call updateOverlay with the correct arguments when useConfirmTradeCancelationOverlay is called', () => {
    const { result } = renderHook(() => useConfirmTradeCancelationOverlay())
    act(() => {
      result.current(contract)
    })
    expect(updateOverlayMock).toHaveBeenCalledWith({
      title: expect.any(String),
      content: expect.any(Object),
      visible: true,
      level: 'WARN',
      action2: {
        label: expect.any(String),
        icon: expect.any(String),
        callback: expect.any(Function),
      },
      action1: {
        label: expect.any(String),
        icon: expect.any(String),
        callback: expect.any(Function),
      },
    })
  })
})
