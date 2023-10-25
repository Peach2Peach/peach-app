import { render } from 'test-utils'
import { defaultUser } from '../../../../tests/unit/data/userData'
import { ProfileOverview } from './ProfileOverview'

describe('ProfileOverview', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<ProfileOverview user={defaultUser} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
