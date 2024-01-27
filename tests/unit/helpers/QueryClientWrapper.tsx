import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      retry: false,
    },
  },
})
export const QueryClientWrapper = ({ children }: { children: React.ReactElement }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
