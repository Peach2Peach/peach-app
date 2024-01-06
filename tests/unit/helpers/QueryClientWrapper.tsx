import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { error } from '../../../src/utils/log/error'
import { info } from '../../../src/utils/log/info'
import { log } from '../../../src/utils/log/log'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      retry: false,
    },
  },
  logger: {
    log,
    warn: info,
    error: process.env.NODE_ENV === 'test' ? jest.fn() : error,
  },
})
export const QueryClientWrapper = ({ children }: { children: React.ReactElement }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
