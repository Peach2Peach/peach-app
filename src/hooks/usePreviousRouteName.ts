import { useNavigation } from './useNavigation'

export const usePreviousRouteName = () => {
  const { routes } = useNavigation().getState()
  return routes[routes.length - 2].name
}
