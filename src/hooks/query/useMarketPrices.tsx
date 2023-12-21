import { useQuery } from '@tanstack/react-query'
import { FIFTEEN_SECONDS } from '../../constants'
import { getAbortWithTimeout } from '../../utils/getAbortWithTimeout'
import { peachAPI } from '../../utils/peachAPI'

export const useMarketPrices = () =>
  useQuery({
    queryKey: ['marketPrices'],
    queryFn: async () => {
      const { result: data, error } = await peachAPI.public.market.marketPrices({
        signal: getAbortWithTimeout(FIFTEEN_SECONDS).signal,
      })
      if (!data) throw new Error(error?.error || 'Error fetching market prices')
      return data
    },
    refetchInterval: FIFTEEN_SECONDS,
  })
