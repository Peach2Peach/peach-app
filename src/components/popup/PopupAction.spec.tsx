import { PopupAction } from './PopupAction'
import { render } from '@testing-library/react-native'
import tw from '../../styles/tailwind'

describe('PopupAction', () => {
  const defaultProps = {
    onPress: jest.fn(),
    label: 'label',
    iconId: 'bitcoinLogo' as const,
    reverseOrder: false,
  }
  it('renders correctly', () => {
    const { toJSON } = render(<PopupAction {...defaultProps} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly with reversed order', () => {
    const { toJSON } = render(<PopupAction {...defaultProps} reverseOrder />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when applying style', () => {
    const { toJSON } = render(<PopupAction {...defaultProps} style={tw`items-center`} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
