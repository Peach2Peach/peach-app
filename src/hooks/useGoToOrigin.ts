import { useCallback } from "react";
import { useStackNavigation } from "./useStackNavigation";

export const useGoToOrigin = () => {
  const navigation = useStackNavigation();
  const goToOrigin = useCallback(
    (origin: keyof RootStackParamList) => {
      const { routes } = navigation.getState();
      const originIndex = routes.findIndex(({ name }) => name === origin);
      if (originIndex === -1) return;

      const stepsBackRequired = routes.length - 1 - originIndex;
      for (let s = stepsBackRequired; s > 0; s--) {
        navigation.goBack();
      }
    },
    [navigation],
  );

  return goToOrigin;
};
