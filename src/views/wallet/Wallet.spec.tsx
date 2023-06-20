import ShallowRenderer from 'react-test-renderer/shallow'
import Wallet from './Wallet'

const useWalletSetupMock = jest.fn()
jest.mock('./hooks/useWalletSetup', () => ({
  useWalletSetup: () => useWalletSetupMock(),
}))

jest.mock('../../utils/wallet/setWallet', () => ({
  peachWallet: {
    synced: true,
  },
}))

describe('Wallet', () => {
  const defaultReturnValue = {
    walletStore: {
      balance: 21,
    },
    refresh: jest.fn(),
    walletLoading: false,
    isRefreshing: false,
    canWithdrawAll: false,
    address: 'address',
    setAddress: jest.fn(),
    addressErrors: '',
    openWithdrawalConfirmation: jest.fn(),
  }
  const renderer = ShallowRenderer.createRenderer()

  it('should render correctly', () => {
    useWalletSetupMock.mockReturnValueOnce(defaultReturnValue)
    renderer.render(<Wallet />)

    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('should render correctly when refreshing', () => {
    useWalletSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      isRefreshing: true,
    })
    renderer.render(<Wallet />)

    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('should render correctly when loading', () => {
    useWalletSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      walletLoading: true,
    })
    renderer.render(<Wallet />)

    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly user can withdraw', () => {
    useWalletSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      canWithdrawAll: true,
    })
    renderer.render(<Wallet />)

    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
