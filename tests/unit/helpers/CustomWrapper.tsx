import { TolgeeProvider } from "@tolgee/react";
import { tolgee } from "../../../src/tolgee";
import { NavigationWrapper } from "./NavigationWrapper";
import { QueryClientWrapper } from "./QueryClientWrapper";

export const CustomWrapper = ({ children }: ComponentProps) => (
  <TolgeeProvider tolgee={tolgee}>
    <QueryClientWrapper>
      <NavigationWrapper>{children}</NavigationWrapper>
    </QueryClientWrapper>
  </TolgeeProvider>
);
