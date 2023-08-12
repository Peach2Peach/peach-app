import { renderHook, waitFor } from '@testing-library/react-native'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { useLastUnusedAddress } from './useLastUnusedAddress'

describe('useLastUnusedAddress', () => {
  beforeAll(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })
  const getLastUnusedAddressMock = jest.fn().mockResolvedValue({
    address: 'bcrt1qj9yqz9qzg9qz9qz9qz9qz9qz9qz9qz9qz9qz9',
    index: 0,
  })
  peachWallet.getLastUnusedAddress = getLastUnusedAddressMock

  it('should return last unused address', async () => {
    const { result } = renderHook(useLastUnusedAddress, { wrapper: QueryClientWrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toEqual({
        address: 'bcrt1qj9yqz9qzg9qz9qz9qz9qz9qz9qz9qz9qz9qz9',
        index: 0,
      })
    })
  })
})
