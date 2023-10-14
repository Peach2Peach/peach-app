import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import i18n from '../../utils/i18n'
import { Message } from './Message'

describe('Message', () => {
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
  const shallowRenderer = createRenderer()
  it('renders correctly', () => {
    shallowRenderer.render(<Message {...defaultProps} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with no action', () => {
    shallowRenderer.render(<Message {...defaultProps} action={undefined} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should use default values for missing translations', () => {
    jest.spyOn(jest.requireMock('../../utils/i18n'), 'default').mockImplementation((key: unknown) => key)
    shallowRenderer.render(<Message {...defaultProps} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should use fallback values for missing props', () => {
    shallowRenderer.render(<Message {...defaultProps} msgKey={undefined} bodyArgs={undefined} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should call onClose when close button is pressed', () => {
    const { getByText } = render(<Message {...defaultProps} />)
    fireEvent.press(getByText(i18n('close')))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })
})
