import { DeleteAccountButton } from './DeleteAccountButton'
import { render } from '@testing-library/react-native'

describe('DeleteAccountButton', () => {
  it('renders correctly', () => {
    const tree = render(<DeleteAccountButton />)
    expect(tree).toMatchSnapshot()
  })
})
