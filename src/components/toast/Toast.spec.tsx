import { fireEvent, render } from 'test-utils'
import i18n from '../../utils/i18n'
import { Toast } from './Toast'
import { useMessageState } from './useMessageState'

jest.mock('react-native-promise-rejection-utils', () => ({
  setUnhandledPromiseRejectionTracker: jest.fn(),
}))

describe('Toast', () => {
  const defaultProps = {
    level: 'APP' as const,
    msgKey: 'NETWORK_ERROR',
    bodyArgs: [],
    action: {
      label: 'testLabel',
      callback: jest.fn(),
    },
    onClose: jest.fn(),
    style: {},
  }
  beforeEach(() => {
    useMessageState.setState(defaultProps)
  })
  it('renders correctly', () => {
    const { toJSON } = render(<Toast />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly with no action', () => {
    useMessageState.setState({ ...defaultProps, action: undefined })
    const { toJSON } = render(<Toast />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should use default values for missing translations', () => {
    jest.spyOn(jest.requireMock('../../utils/i18n'), 'default').mockImplementation((key: unknown) => key)

    const { toJSON } = render(<Toast />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should call onClose when close button is pressed', () => {
    const { getByText } = render(<Toast />)
    fireEvent.press(getByText(i18n('close')))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })
})
