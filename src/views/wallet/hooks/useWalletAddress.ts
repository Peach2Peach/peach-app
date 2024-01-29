import { useQuery } from '@tanstack/react-query'
import { MSINAMINUTE } from '../../../constants'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useWalletAddress = (index: number) =>
  useQuery({
    queryKey: ['receiveAddress', index] as const,
    queryFn: ({ queryKey: [, addressIndex] }) => peachWallet.getAddressByIndex(addressIndex),
    enabled: peachWallet.initialized && index >= 0,
    gcTime: MSINAMINUTE,
  })
