import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClientWrapper = ({ children }: any) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: Infinity,
        retry: false,
      },
    },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
