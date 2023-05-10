import { Rate } from './Rate'
import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'

describe('Rate', () => {
  it('should render correctly', () => {
    const contract = {} as Contract
    const view = 'buyer'
    const saveAndUpdate = jest.fn()
    const vote = 'positive'

    const { toJSON } = render(<Rate {...{ contract, view, vote, saveAndUpdate }} />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
