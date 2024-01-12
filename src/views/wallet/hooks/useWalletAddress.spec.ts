import { renderHook, waitFor } from 'test-utils'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletAddress } from './useWalletAddress'

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
jest.useFakeTimers()

describe('useWalletAddress', () => {
  beforeAll(() => {
    // @ts-expect-error mock doesn't need args
    setPeachWallet(new PeachWallet())
  })

  it('should return the address at the given index', async () => {
    peachWallet.getAddressByIndex = jest.fn().mockImplementation((index: number) => Promise.resolve(addresses[index]))
    const initialProps = 0
    const { result, rerender } = renderHook<ReturnType<typeof useWalletAddress>, number>(useWalletAddress, {
      initialProps,
    })

    await waitFor(() => {
      expect(result.current.data).toBe(addresses[0])
    })

    rerender(1)

    await waitFor(() => {
      expect(result.current.data).toBe(addresses[1])
    })

    rerender(2)

    await waitFor(() => {
      expect(result.current.data).toBe(addresses[2])
    })
  })
})
