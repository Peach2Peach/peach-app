import { useStackNavigation } from "./useStackNavigation";

export const usePreviousRoute = () => {
  const { routes } = useStackNavigation().getState();
  return routes[routes.length - 2];
};
