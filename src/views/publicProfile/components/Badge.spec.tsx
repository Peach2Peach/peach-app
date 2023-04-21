import { Badge } from './Badge'
import { render } from '@testing-library/react-native'

describe('Badge', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Badge isUnlocked={false} iconId="zap" badgeName="fastTrader" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly if badge is unlocked', () => {
    const { toJSON } = render(<Badge isUnlocked={true} iconId="zap" badgeName="fastTrader" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with dispute active', () => {
    const { toJSON } = render(<Badge isUnlocked={false} iconId="zap" badgeName="fastTrader" isDispute />)
    expect(toJSON()).toMatchSnapshot()
  })
})
