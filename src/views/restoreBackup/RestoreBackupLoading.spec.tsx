import { render } from '@testing-library/react-native'
import { useHeaderState } from '../../components/header/store'
import { RestoreBackupLoading } from './RestoreBackupLoading'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'

describe('RestoreBackupLoading', () => {
  beforeEach(() => {
    useHeaderState.setState({ title: '', icons: [] })
  })
  it('should render correctly', () => {
    const { toJSON } = render(<RestoreBackupLoading />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set header correctly', () => {
    render(<RestoreBackupLoading />, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('restore reputation')
    expect(useHeaderState.getState().icons).toHaveLength(0)
    expect(useHeaderState.getState().hideGoBackButton).toBeTruthy()
  })
})
