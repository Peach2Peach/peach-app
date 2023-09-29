import { render } from '@testing-library/react-native'
import { NavigationWrapper as wrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { NewBadges } from './Badges'

jest.mock('./Badge', () => ({
  Badge: 'Badge',
}))

describe('Badges', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<NewBadges unlockedBadges={[]} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with unlocked badges', () => {
    const { toJSON } = render(<NewBadges unlockedBadges={['ambassador', 'superTrader', 'fastTrader']} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
