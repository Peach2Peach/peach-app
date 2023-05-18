import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../components/header/store'
import { settingsStore } from '../../store/settingsStore'
import Welcome from './Welcome'

describe('Welcome', () => {
  beforeEach(() => {
    useHeaderState.setState({ title: '', icons: [] })
  })
  it('should render correctly', () => {
    settingsStore.getState().setUsedReferralCode(true)

    const { toJSON } = render(<Welcome />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should set header correctly', () => {
    render(<Welcome />, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('welcome to Peach!')
    expect(useHeaderState.getState().hideGoBackButton).toBeTruthy()
  })
})
