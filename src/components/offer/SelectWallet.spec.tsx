import { fireEvent, render } from '@testing-library/react-native'
import { SelectWallet } from './SelectWallet'
import { NavigationWrapper, navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { settingsStore } from '../../store/settingsStore'

const payoutWalletLabel = 'My custom address'
describe('SelectWallet', () => {
  afterEach(() => {
    settingsStore.getState().reset()
  })
  it('renders correctly when only peach wallet exists', () => {
    const { toJSON } = render(<SelectWallet type="refund" />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when custom wallet exists', () => {
    settingsStore.getState().setPayoutAddressLabel(payoutWalletLabel)
    const { toJSON } = render(<SelectWallet type="refund" />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should navigate to custom payout address when clicking on +', () => {
    const { getByTestId } = render(<SelectWallet type="refund" />, { wrapper: NavigationWrapper })
    fireEvent(getByTestId('goToPayoutAddress'), 'onPress')
    expect(navigateMock).toHaveBeenCalledWith('payoutAddress', { type: 'refund' })
  })
  it('should select custom wallet when clicking on it', () => {
    settingsStore.getState().setPayoutAddressLabel(payoutWalletLabel)
    expect(settingsStore.getState().peachWalletActive).toBeTruthy()
    const { getByText } = render(<SelectWallet type="refund" />, { wrapper: NavigationWrapper })
    fireEvent(getByText(payoutWalletLabel), 'onPress')
    expect(settingsStore.getState().peachWalletActive).toBeFalsy()
  })
  it('should select peach wallet when clicking on it', () => {
    settingsStore.getState().setPayoutAddressLabel(payoutWalletLabel)
    settingsStore.getState().setPeachWalletActive(false)
    expect(settingsStore.getState().peachWalletActive).toBeFalsy()
    const { getByText } = render(<SelectWallet type="refund" />, { wrapper: NavigationWrapper })
    fireEvent(getByText('Peach wallet'), 'onPress')
    expect(settingsStore.getState().peachWalletActive).toBeTruthy()
  })
})
