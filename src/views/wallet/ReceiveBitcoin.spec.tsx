import { render, waitFor } from 'test-utils'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../utils/wallet/setWallet'
import { ReceiveBitcoin } from './ReceiveBitcoin'

jest.useFakeTimers()

const addresses = [
  {
    index: 0,
    address: 'firstAddress',
    used: true,
  },
  {
    index: 1,
    address: 'secondAddress',
    used: false,
  },
  {
    index: 2,
    address: 'thirdAddress',
    used: false,
  },
]

describe('ReceiveBitcoin', () => {
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }))
    peachWallet.initialized = true
  })

  it('should render correctly while loading', () => {
    const { toJSON } = render(<ReceiveBitcoin />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when loaded', async () => {
    peachWallet.getLastUnusedAddress = jest.fn().mockResolvedValue(addresses[1])
    peachWallet.getAddressByIndex = jest.fn().mockImplementation((index: number) => Promise.resolve(addresses[index]))
    const { toJSON } = render(<ReceiveBitcoin />)

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })

    expect(toJSON()).toMatchSnapshot()
  })
})
