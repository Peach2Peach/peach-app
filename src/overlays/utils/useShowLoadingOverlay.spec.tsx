import { act, renderHook } from '@testing-library/react-hooks'
import { useShowLoadingOverlay } from './useShowLoadingOverlay'

const useOverlayContextMock = jest.fn()
jest.mock('../../contexts/overlay', () => ({
  useOverlayContext: () => useOverlayContextMock(),
}))

describe('useShowLoadingOverlay', () => {
  const updateOverlayMock = jest.fn()
  beforeEach(() => {
    useOverlayContextMock.mockReturnValue([, updateOverlayMock])
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should call updateOverlay with the correct arguments when showLoadingOverlay is called', () => {
    const { result } = renderHook(() => useShowLoadingOverlay())
    act(() => {
      result.current('title')
    })
    expect(updateOverlayMock).toHaveBeenCalledWith({
      title: 'title',
      content: expect.any(Object),
      visible: true,
      level: 'WARN',
      requireUserAction: true,
      action1: {
        label: expect.any(String),
        icon: expect.any(String),
        callback: expect.any(Function),
      },
    })
  })
})
