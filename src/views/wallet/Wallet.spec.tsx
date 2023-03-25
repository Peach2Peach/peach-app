import React from 'react'
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
    onChange: jest.fn(),
    isValid: true,
    address: 'address',
    addressErrors: '',
    openWithdrawalConfirmation: jest.fn(),
  }
  const renderer = ShallowRenderer.createRenderer()

  it('should render correctly', () => {
    useWalletSetupMock.mockReturnValueOnce(defaultReturnValue)
    renderer.render(<Wallet />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })

  it('should render correctly when refreshing', () => {
    useWalletSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      isRefreshing: true,
    })
    renderer.render(<Wallet />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })

  it('should render correctly when loading', () => {
    useWalletSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      walletLoading: true,
    })
    renderer.render(<Wallet />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
})
