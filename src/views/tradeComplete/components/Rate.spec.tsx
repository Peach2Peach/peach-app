import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { Rate } from './Rate'

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
