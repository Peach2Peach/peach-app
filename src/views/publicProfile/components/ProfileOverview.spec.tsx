import { render } from '@testing-library/react-native'
import { defaultUser } from '../../../../tests/unit/data/userData'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { ProfileOverview } from './ProfileOverview'

describe('ProfileOverview', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<ProfileOverview user={defaultUser} />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
