import { render } from '@testing-library/react-native'
import { UserExistsForDevice } from './UserExistsForDevice'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'

describe('UserExistsForDevice', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<UserExistsForDevice />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
