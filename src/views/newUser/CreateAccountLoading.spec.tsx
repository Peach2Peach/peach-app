import { render } from '@testing-library/react-native'
import { CreateAccountLoading } from './CreateAccountLoading'
import { headerState, NavigationWrapper, setOptionsMock } from '../../../tests/unit/helpers/NavigationWrapper'

describe('CreateAccountLoading', () => {
  beforeEach(() => {
    setOptionsMock({ header: { title: '', icons: [] } })
  })
  it('should render correctly', () => {
    const { toJSON } = render(<CreateAccountLoading />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set header correctly', () => {
    render(<CreateAccountLoading />, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
