import { useSettingsStore } from '../../store/useSettingsStore'
import i18n from '../../utils/i18n'
import { WalletLabel } from './WalletLabel'
import { render, waitFor } from '@testing-library/react-native'
import { Text } from '../text'

const findKeyPairByAddressMock = jest.fn()
jest.mock('../../utils/wallet/setWallet', () => ({
  peachWallet: {
    findKeyPairByAddress: (...args: any) => findKeyPairByAddressMock(...args),
  },
}))

jest.useFakeTimers()

describe('WalletLabel', () => {
  it('should render correctly if label is known', () => {
    const { toJSON } = render(<WalletLabel label="Wallet Label" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should first signal that it is loading if label is not known', () => {
    const address = 'address'
    const addressLabel = 'addressLabel'
    useSettingsStore.getState().setPayoutAddress(address)
    useSettingsStore.getState().setPayoutAddressLabel(addressLabel)
    const { toJSON } = render(<WalletLabel {...{ address }} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly if address is payout address', async () => {
    const address = 'address'
    const addressLabel = 'addressLabel'
    useSettingsStore.getState().setPayoutAddress(address)
    useSettingsStore.getState().setPayoutAddressLabel(addressLabel)
    const { toJSON, getByText } = render(
      <Text>
        <WalletLabel {...{ address }} />
      </Text>,
    )
    await waitFor(() => expect(getByText(addressLabel)).toBeDefined())
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly if address is peach wallet address', async () => {
    const address = 'peachAddress'
    findKeyPairByAddressMock.mockReturnValueOnce(true)
    const { toJSON, getByText } = render(
      <Text>
        <WalletLabel {...{ address }} />
      </Text>,
    )
    await waitFor(() => expect(getByText(i18n('peachWallet'))).toBeDefined())
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly if address is unknown', async () => {
    const address = 'unknownAddress'
    const { toJSON, getByText } = render(
      <Text>
        <WalletLabel {...{ address }} />
      </Text>,
    )
    await waitFor(() => expect(getByText(i18n('offer.summary.customPayoutAddress'))).toBeDefined())
    expect(toJSON()).toMatchSnapshot()
  })
})
