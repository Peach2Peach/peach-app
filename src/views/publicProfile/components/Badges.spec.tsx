import { NewBadges } from './Badges'
import { render } from '@testing-library/react-native'
import { NavigationContext } from '@react-navigation/native'

const navigationWrapper: React.ComponentType<any> | undefined = ({ children }: any) => (
  // @ts-ignore
  <NavigationContext.Provider value={{ navigate: jest.fn() }}>{children}</NavigationContext.Provider>
)

jest.mock('./Badge', () => ({
  Badge: 'Badge',
}))

describe('Badges', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<NewBadges user={{ medals: [] } as unknown as User} />, { wrapper: navigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with unlocked badges', () => {
    const { toJSON } = render(
      <NewBadges user={{ medals: ['ambassador', 'superTrader', 'fastTrader'] } as unknown as User} />,
      {
        wrapper: navigationWrapper,
      },
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
