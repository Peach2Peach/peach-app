import { EditPremium } from './EditPremium'
import { render } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'

jest.useFakeTimers()

describe('EditPremium', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<EditPremium />, { wrapper: NavigationAndQueryClientWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
