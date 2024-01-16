import { toMatchDiffSnapshot } from 'snapshot-diff'
import { act, render, renderHook } from 'test-utils'
import { Toast, useSetToast } from './Toast'
expect.extend({ toMatchDiffSnapshot })

jest.useFakeTimers()

describe('Toast', () => {
  const defaultProps = {
    level: 'DEFAULT' as const,
    msgKey: 'NETWORK_ERROR',
    bodyArgs: [],
    action: {
      label: 'testLabel',
      onPress: jest.fn(),
      iconId: 'bitcoin',
    },
  }
  it('renders correctly', () => {
    const { result } = renderHook(useSetToast)
    const { toJSON } = render(<Toast />)
    act(() => {
      result.current(defaultProps)
    })
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly with no action', () => {
    const { result } = renderHook(useSetToast)
    act(() => {
      result.current(defaultProps)
    })
    const { toJSON } = render(<Toast />)
    const withAction = toJSON()
    act(() => {
      result.current({ ...defaultProps, action: undefined })
    })
    const withoutAction = toJSON()
    expect(withAction).toMatchDiffSnapshot(withoutAction)
  })
  it('should use default values for missing translations', () => {
    jest.spyOn(jest.requireMock('../../utils/i18n'), 'default').mockImplementation((key: unknown) => key)

    const { toJSON } = render(<Toast />)
    expect(toJSON()).toMatchSnapshot()
  })
})
