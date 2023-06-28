import { NavigationWrapper } from './NavigationWrapper'
import { QueryClientWrapper } from './QueryClientWrapper'

export const NavigationAndQueryClientWrapper = ({ children }: ComponentProps) => (
  <QueryClientWrapper>
    <NavigationWrapper>{children}</NavigationWrapper>
  </QueryClientWrapper>
)
