import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { NewBadges } from './Badges'

jest.mock('./Badge', () => ({
  Badge: 'Badge',
}))

describe('Badges', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<NewBadges user={{ medals: [] } as unknown as User} />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with unlocked badges', () => {
    const { toJSON } = render(
      <NewBadges user={{ medals: ['ambassador', 'superTrader', 'fastTrader'] } as unknown as User} />,
      { wrapper: NavigationWrapper },
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
