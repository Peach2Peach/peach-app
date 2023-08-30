import { render } from '@testing-library/react-native'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import tw from '../../styles/tailwind'
import { PopupAction } from './PopupAction'
expect.extend({ toMatchDiffSnapshot })

describe('PopupAction', () => {
  const defaultProps = {
    onPress: jest.fn(),
    label: 'label',
    iconId: 'bitcoinLogo' as const,
    reverseOrder: false,
  }
  const defaultComponent = <PopupAction {...defaultProps} />
  it('renders correctly', () => {
    const { toJSON } = render(defaultComponent)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly with reversed order', () => {
    const { toJSON } = render(<PopupAction {...defaultProps} reverseOrder />)
    expect(render(defaultComponent).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('renders correctly when applying style', () => {
    const { toJSON } = render(<PopupAction {...defaultProps} style={tw`items-start`} />)
    expect(render(defaultComponent).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('renders correctly when loading', () => {
    const { toJSON } = render(<PopupAction {...defaultProps} loading />)
    expect(render(defaultComponent).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
