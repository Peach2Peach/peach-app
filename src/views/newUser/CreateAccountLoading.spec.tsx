import { render } from '@testing-library/react-native'
import { useHeaderState } from '../../components/header/store'
import { CreateAccountLoading } from './CreateAccountLoading'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'

describe('CreateAccountLoading', () => {
  beforeEach(() => {
    useHeaderState.setState({ title: '', icons: [] })
  })
  it('should render correctly', () => {
    const { toJSON } = render(<CreateAccountLoading />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set header correctly', () => {
    render(<CreateAccountLoading />, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('welcome to Peach!')
    expect(useHeaderState.getState().icons).toHaveLength(0)
    expect(useHeaderState.getState().hideGoBackButton).toBeTruthy()
  })
})
