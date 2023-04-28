import { fireEvent, render } from '@testing-library/react-native'
import { NavigationWrapper, goBackMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../components/header/store'
import RedesignWelcome from './RedesignWelcome'
import { settingsStore } from '../../store/settingsStore'
import { configStore } from '../../store/configStore'

describe('RedesignWelcome', () => {
  beforeEach(() => {
    useHeaderState.setState({ title: '', icons: [] })
  })
  it('should render correctly with referral code set', () => {
    settingsStore.getState().setUsedReferralCode(true)

    const { toJSON } = render(<RedesignWelcome />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set that the message has been seen', () => {
    const { getByTestId } = render(<RedesignWelcome />, { wrapper: NavigationWrapper })
    fireEvent(getByTestId('redesignWelcome-close'), 'onPress')
    expect(configStore.getState().hasSeenRedesignWelcome).toBeTruthy()
  })
  it('should close welcome screen', () => {
    const { getByTestId } = render(<RedesignWelcome />, { wrapper: NavigationWrapper })
    fireEvent(getByTestId('redesignWelcome-close'), 'onPress')
    expect(goBackMock).toHaveBeenCalled()
  })
  it('should render correctly', () => {
    const { toJSON } = render(<RedesignWelcome />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set header correctly', () => {
    render(<RedesignWelcome />, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('')
    expect(useHeaderState.getState().icons).toHaveLength(0)
    expect(useHeaderState.getState().hideGoBackButton).toBeTruthy()
  })
})
