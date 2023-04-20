import { Badge } from './Badge'
import { render } from '@testing-library/react-native'

describe('Badge', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Badge unlockedBadges={[]} iconId="zap" badgeName="fastTrader" isDispute />)
    expect(toJSON()).toMatchSnapshot()
  })
})
