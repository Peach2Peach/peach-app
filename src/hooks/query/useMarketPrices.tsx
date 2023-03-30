import { useQuery } from '@tanstack/react-query'

import { marketPrices } from '../../utils/peachAPI/public/market'

const FIFTEEN_SECONDS = 15 * 1000
export const useMarketPrices = () => {
  const queryData = useQuery({
    queryKey: ['marketPrices'],
    queryFn: async () => (await marketPrices({ timeout: FIFTEEN_SECONDS }))[0],
    refetchInterval: FIFTEEN_SECONDS,
  })

  return queryData
}
