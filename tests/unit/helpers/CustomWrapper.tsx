import { ReactNode } from "react";
import { NavigationWrapper } from "./NavigationWrapper";
import { QueryClientWrapper } from "./QueryClientWrapper";

export const CustomWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientWrapper>
    <NavigationWrapper>{children}</NavigationWrapper>
  </QueryClientWrapper>
);
