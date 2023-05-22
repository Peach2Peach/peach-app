import { PopupAction } from './PopupAction'
import { render } from '@testing-library/react-native'
import tw from '../styles/tailwind'

describe('PopupAction', () => {
  const defaultProps = {
    onPress: jest.fn(),
    label: 'label',
    iconId: 'bitcoinLogo' as const,
    color: tw`text-primary-main`,
    isDisabled: false,
    reverseOrder: false,
  }
  it('renders correctly', () => {
    const { toJSON } = render(<PopupAction {...defaultProps} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    const { toJSON } = render(<PopupAction {...defaultProps} isDisabled />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly with reversed order', () => {
    const { toJSON } = render(<PopupAction {...defaultProps} reverseOrder />)
    expect(toJSON()).toMatchSnapshot()
  })
})
