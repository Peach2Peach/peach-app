import { render } from '@testing-library/react-native'
import { useHeaderState } from '../../components/header/store'
import { RestoreReputationLoading } from './RestoreReputationLoading'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'

describe('RestoreReputationLoading', () => {
  beforeEach(() => {
    useHeaderState.setState({ title: '', icons: [] })
  })
  it('should render correctly', () => {
    const { toJSON } = render(<RestoreReputationLoading />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set header correctly', () => {
    render(<RestoreReputationLoading />, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('restore backup')
    expect(useHeaderState.getState().icons).toHaveLength(0)
    expect(useHeaderState.getState().hideGoBackButton).toBeTruthy()
  })
})
