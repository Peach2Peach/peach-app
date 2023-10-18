import { render } from 'test-utils'
import { CoinControl } from './CoinControl'

describe('CoinControl', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<CoinControl />)
    expect(toJSON()).toMatchSnapshot()
  })
})
