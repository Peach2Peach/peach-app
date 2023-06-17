import { render } from '@testing-library/react-native'
import { UserExistsForDevice } from './UserExistsForDevice'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'

const useRouteMock = jest.fn().mockReturnValue({
  params: {},
})
jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

describe('UserExistsForDevice', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<UserExistsForDevice />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
