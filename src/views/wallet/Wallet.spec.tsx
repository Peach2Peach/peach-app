import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { LocalUtxo, OutPoint, TxOut } from 'bdk-rn/lib/classes/Bindings'
import { Script } from 'bdk-rn/lib/classes/Script'
import { KeychainKind } from 'bdk-rn/lib/lib/enums'
import ShallowRenderer from 'react-test-renderer/shallow'
import { confirmed1 } from '../../../tests/unit/data/transactionDetailData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
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
jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({
    name: 'wallet',
  })),
}))

const addresses = {
  first: {
    address: 'firstAddress',
    used: true,
    index: 0,
  },
  second: {
    address: 'secondAddress',
    used: true,
    index: 1,
  },
  previous: {
    address: 'previousAddress',
    used: true,
    index: 20,
  },
  lastUnused: {
    address: 'lastUnusedAddress',
    used: false,
    index: 21,
  },
  next: {
    address: 'nextAddress',
    used: false,
    index: 22,
  },
}

jest.useFakeTimers()

const outpoint = new OutPoint(confirmed1.txid, 0)
const txOut = new TxOut(10000, new Script('address'))
const utxo = new LocalUtxo(outpoint, txOut, false, KeychainKind.External)
const listUnspentMock = jest.fn().mockResolvedValue([utxo])
jest.mock('../../utils/wallet/setWallet', () => ({
  peachWallet: {
    synced: true,
    getAddressByIndex: jest.fn((index: number) => {
      if (index === 0) return Promise.resolve(addresses.first)
      if (index === 1) return Promise.resolve(addresses.second)
      if (index === 20) return Promise.resolve(addresses.previous)
      if (index === 21) return Promise.resolve(addresses.lastUnused)
      if (index === 22) return Promise.resolve(addresses.next)
      return Promise.resolve(undefined)
    }),
    getLastUnusedAddress: jest.fn(() => Promise.resolve(addresses.lastUnused)),
    wallet: {
      listUnspent: () => listUnspentMock(),
    },
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
  it('should navigate to send screen when send button is pressed', () => {
    const { getByText } = render(<Wallet />, { wrapper: NavigationAndQueryClientWrapper })
    fireEvent.press(getByText('send'))

    expect(navigateMock).toHaveBeenCalledWith('sendBitcoin')
  })
  it('should navigate to receive screen when receive button is pressed', () => {
    const { getByText } = render(<Wallet />, { wrapper: NavigationAndQueryClientWrapper })
    fireEvent.press(getByText('receive'))

    expect(navigateMock).toHaveBeenCalledWith('receiveBitcoin')
  })
  it('should prefetch addresses', async () => {
    render(<Wallet />, { wrapper: NavigationAndQueryClientWrapper })

    await waitFor(() => {
      expect(queryClient.getQueriesData(['receiveAddress'])).toEqual([
        [['receiveAddress', 0], addresses.first],
        [['receiveAddress', 1], addresses.second],
        [['receiveAddress', -1], undefined],
        [['receiveAddress', 21], addresses.lastUnused],
        [['receiveAddress', 22], addresses.next],
        [['receiveAddress', 20], addresses.previous],
      ])
    })
  })
  it('should prefetch utxos', async () => {
    render(<Wallet />, { wrapper: NavigationAndQueryClientWrapper })

    await waitFor(() => {
      expect(queryClient.getQueryData(['utxos'])).toEqual([utxo])
    })
  })
})
