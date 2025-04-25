import { NavigationWrapper } from "./NavigationWrapper";
import { QueryClientWrapper } from "./QueryClientWrapper";

export const CustomWrapper = ({ children }: ComponentProps) => (
  <QueryClientWrapper>
    <NavigationWrapper>{children}</NavigationWrapper>
  </QueryClientWrapper>
);
