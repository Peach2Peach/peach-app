import { render, waitFor } from 'test-utils'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/CustomWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
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
const wrapper = NavigationAndQueryClientWrapper

describe('ReceiveBitcoin', () => {
  beforeAll(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })

  it('should render correctly while loading', () => {
    const { toJSON } = render(<ReceiveBitcoin />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when loaded', async () => {
    peachWallet.getLastUnusedAddress = jest.fn().mockResolvedValue(addresses[1])
    peachWallet.getAddressByIndex = jest.fn().mockImplementation((index: number) => Promise.resolve(addresses[index]))
    const { toJSON } = render(<ReceiveBitcoin />, { wrapper })

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })

    expect(toJSON()).toMatchSnapshot()
  })
})
