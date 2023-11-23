import { renderHook, waitFor } from 'test-utils'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { useLastUnusedAddress } from './useLastUnusedAddress'

describe('useLastUnusedAddress', () => {
  beforeAll(() => {
    // @ts-expect-error mock doesn't need args
    setPeachWallet(new PeachWallet())
  })
  const getLastUnusedAddressMock = jest.fn().mockResolvedValue({
    address: 'bcrt1qj9yqz9qzg9qz9qz9qz9qz9qz9qz9qz9qz9qz9',
    index: 0,
  })

  it('should return last unused address', async () => {
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock
    const { result } = renderHook(useLastUnusedAddress)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toEqual({
        address: 'bcrt1qj9yqz9qzg9qz9qz9qz9qz9qz9qz9qz9qz9qz9',
        index: 0,
      })
    })
  })
})
