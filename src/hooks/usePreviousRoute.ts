import { useNavigation } from './useNavigation'

export const usePreviousRoute = () => {
  const { routes } = useNavigation().getState()
  return routes[routes.length - 2]
}
