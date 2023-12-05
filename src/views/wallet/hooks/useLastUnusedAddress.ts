import { useQuery } from '@tanstack/react-query'
import { peachWallet } from '../../../utils/wallet/setWallet'

export const useLastUnusedAddress = () =>
  useQuery({
    queryKey: ['lastUnusedAddress'],
    queryFn: () => peachWallet.getLastUnusedAddress(),
    enabled: peachWallet.initialized,
  })
