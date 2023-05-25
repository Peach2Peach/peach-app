import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import Language from './Language'

describe('Language', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<Language />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
