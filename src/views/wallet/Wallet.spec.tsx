import ShallowRenderer from 'react-test-renderer/shallow'
import { Wallet } from './Wallet'

const defaultReturnValue = {
  balance: 21,
  isRefreshing: false,
  walletLoading: false,
}
const useWalletSetupMock = jest.fn(() => defaultReturnValue)
jest.mock('./hooks/useWalletSetup', () => ({
  useWalletSetup: () => useWalletSetupMock(),
}))

jest.mock('../../utils/wallet/setWallet', () => ({
  peachWallet: {
    synced: true,
  },
}))

describe('Wallet', () => {
  const renderer = ShallowRenderer.createRenderer()

  it('should render correctly', () => {
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
  it.todo('should navigate to send screen when send button is pressed')
  it.todo('should navigate to receive screen when receive button is pressed')
})
