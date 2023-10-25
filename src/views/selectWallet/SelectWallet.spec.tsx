import { render } from 'test-utils'
import { SelectWallet } from './SelectWallet'

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

jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({
    params: {
      type: 'payout',
    },
  })),
}))

describe('SelectWallet', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<SelectWallet />)

    expect(toJSON()).toMatchSnapshot()
  })
})
