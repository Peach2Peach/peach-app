import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { error, info, log } from '../../../src/utils/log'

export const queryClientWrapper = ({ children }: any) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: Infinity,
        retry: false,
      },
    },
    logger: {
      log,
      warn: info,
      error: process.env.NODE_ENV === 'test' ? () => {} : error,
    },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
