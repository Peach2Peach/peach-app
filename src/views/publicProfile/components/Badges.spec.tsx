import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { MatchBadges } from './Badges'

jest.mock('./Badge', () => ({
  Badge: 'Badge',
}))

describe('Badges', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<MatchBadges user={{ medals: [] } as unknown as User} />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with unlocked badges', () => {
    const { toJSON } = render(
      <MatchBadges user={{ medals: ['ambassador', 'superTrader', 'fastTrader'] } as unknown as User} />,
      { wrapper: NavigationWrapper },
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
