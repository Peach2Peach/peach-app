import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { Currency } from './Currency'

describe('Currency', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Currency />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
