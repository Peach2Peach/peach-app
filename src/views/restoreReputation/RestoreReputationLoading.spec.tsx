import { render } from '@testing-library/react-native'
import { RestoreReputationLoading } from './RestoreReputationLoading'
import { headerState, NavigationWrapper, setOptionsMock } from '../../../tests/unit/helpers/NavigationWrapper'

describe('RestoreReputationLoading', () => {
  beforeEach(() => {
    setOptionsMock({ header: { title: '', icons: [] } })
  })
  it('should render correctly', () => {
    const { toJSON } = render(<RestoreReputationLoading />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set header correctly', () => {
    render(<RestoreReputationLoading />, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
