import { render } from '@testing-library/react-native'
import { CoinControl } from './CoinControl'

describe('CoinControl', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<CoinControl />)
    expect(toJSON()).toMatchSnapshot()
  })
})
