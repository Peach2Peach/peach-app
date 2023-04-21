import { settingsStore } from '../../store/settingsStore'
import i18n from '../../utils/i18n'
import { WalletLabel } from './WalletLabel'
import { render, waitFor } from '@testing-library/react-native'

const findKeyPairByAddressMock = jest.fn()
jest.mock('../../utils/wallet/setWallet', () => ({
  peachWallet: {
    findKeyPairByAddress: (...args: any) => findKeyPairByAddressMock(...args),
  },
}))

describe('WalletLabel', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render correctly if label is known', () => {
    const { toJSON } = render(<WalletLabel label="Wallet Label" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should first signal that it is loading if label is not known', async () => {
    const address = 'address'
    const addressLabel = 'addressLabel'
    settingsStore.getState().setPayoutAddress(address)
    settingsStore.getState().setPayoutAddressLabel(addressLabel)
    const { toJSON } = render(<WalletLabel {...{ address }} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly if address is payout address', async () => {
    const address = 'address'
    const addressLabel = 'addressLabel'
    settingsStore.getState().setPayoutAddress(address)
    settingsStore.getState().setPayoutAddressLabel(addressLabel)
    const { toJSON, getByText } = render(<WalletLabel {...{ address }} />)
    await waitFor(() => expect(getByText(addressLabel)).toBeDefined())
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly if address is peach wallet address', async () => {
    const address = 'peachAddress'
    findKeyPairByAddressMock.mockReturnValueOnce(true)
    const { toJSON, rerender, getByText } = render(<WalletLabel {...{ address }} />)
    rerender(<WalletLabel {...{ address }} />)
    const { toJSON, getByText } = render(<WalletLabel {...{ address }} />)
    await waitFor(() => expect(getByText(i18n('peachWallet'))).toBeDefined())
  })
  it('should render correctly if address is unknown', async () => {
    const address = 'unknownAddress'
    const { toJSON, getByText } = render(<WalletLabel {...{ address }} />)
    await waitFor(() => expect(getByText(i18n('offer.summary.customPayoutAddress'))).toBeDefined())
    expect(toJSON()).toMatchSnapshot()
  })
})
