import { TransitionSpec } from "@react-navigation/stack/lib/typescript/src/types";

export const screenTransition: TransitionSpec = {
  animation: "timing",
  config: {
    duration: 150,
    delay: 0,
  },
};
