import { SelectWallet } from './SelectWallet'
import { render } from '@testing-library/react-native'

const useSelectWalletSetupMock = jest.fn().mockReturnValue({
  type: 'payout',
  wallets: [
    {
      value: 'peachWallet',
      display: 'Peach wallet',
    },
  ],
  peachWalletActive: true,
  setSelectedWallet: jest.fn(),
  payoutAddress: undefined,
  goToSetRefundWallet: jest.fn(),
  selectAndContinue: jest.fn(),
})

jest.mock('./hooks/useSelectWalletSetup', () => ({
  useSelectWalletSetup: () => useSelectWalletSetupMock(),
}))

describe('SelectWallet', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<SelectWallet />)

    expect(toJSON()).toMatchSnapshot()
  })
})
