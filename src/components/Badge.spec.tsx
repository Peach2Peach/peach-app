import { render } from 'test-utils'
import { Badge } from './Badge'

describe('Badge', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Badge isUnlocked={false} badgeName="fastTrader" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly if badge is unlocked', () => {
    const { toJSON } = render(<Badge isUnlocked={true} badgeName="fastTrader" />)
    expect(toJSON()).toMatchSnapshot()
  })
})
