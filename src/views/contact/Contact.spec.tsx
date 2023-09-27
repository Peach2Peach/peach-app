import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { Contact } from './Contact'

describe('Contact', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Contact />, { wrapper: NavigationWrapper })

    expect(toJSON()).toMatchSnapshot()
  })
})
