import { render } from '@testing-library/react-native'
import { RestoreBackupLoading } from './RestoreBackupLoading'
import { headerState, NavigationWrapper, setOptionsMock } from '../../../tests/unit/helpers/NavigationWrapper'

describe('RestoreBackupLoading', () => {
  beforeEach(() => {
    setOptionsMock({ header: { title: '', icons: [] } })
  })
  it('should render correctly', () => {
    const { toJSON } = render(<RestoreBackupLoading />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set header correctly', () => {
    render(<RestoreBackupLoading />, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
