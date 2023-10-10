import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { Settings } from './Settings'

jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => ({
    name: 'settings',
  }),
}))

describe('Settings', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Settings />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
