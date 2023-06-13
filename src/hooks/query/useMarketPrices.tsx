import { useQuery } from '@tanstack/react-query'
import { marketPrices } from '../../utils/peachAPI/public/market'

const FIFTEEN_SECONDS = 15 * 1000
export const useMarketPrices = () => {
  const queryData = useQuery({
    queryKey: ['marketPrices'],
    queryFn: async () => {
      const [data, error] = await marketPrices({ timeout: FIFTEEN_SECONDS })
      if (!data) throw new Error(error?.error || 'Error fetching market prices')
      return data
    },
    refetchInterval: FIFTEEN_SECONDS,
  })

  return queryData
}
