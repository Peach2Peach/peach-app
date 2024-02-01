import { toMatchDiffSnapshot } from 'snapshot-diff'
import { render } from 'test-utils'
import { ProfileInfo } from './ProfileInfo'
expect.extend({ toMatchDiffSnapshot })

describe('ProfileInfo', () => {
  const user = {
    id: '123',
    rating: 1,
    openedTrades: 21,
    canceledTrades: 0,
    medals: ['ambassador'] as Medal[],
    disputes: { opened: 0, won: 0, lost: 0, resolved: 0 },
  }
  const defaultComponent = <ProfileInfo user={user} />
  it('renders correctly',
    () => {
      const { toJSON } = render(defaultComponent)
      expect(toJSON()).toMatchSnapshot()
    })
  it('renders correctly for a new user', () => {
    const { toJSON } = render(<ProfileInfo user={{ ...user, openedTrades: 2 }} />)
    expect(render(defaultComponent).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('renders correctly for a new user who canceled a trade', () => {
    const { toJSON } = render(<ProfileInfo user={{ ...user, canceledTrades: 1 }} />)
    expect(render(defaultComponent).toJSON()).toMatchDiffSnapshot(toJSON())
  })
  it('renders correctly for a new user who lost a dispute', () => {
    const { toJSON } = render(<ProfileInfo user={{ ...user, disputes: { ...user.disputes, lost: 1 } }} />)
    expect(render(defaultComponent).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
