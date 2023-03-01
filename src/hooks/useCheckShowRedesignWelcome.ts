import { useNavigation } from '.'
import { useConfigStore } from '../store/configStore'

export const useCheckShowRedesignWelcome = () => {
  const navigation = useNavigation()
  const hasSeenRedesignWelcome = useConfigStore((state) => state.hasSeenRedesignWelcome)

  const checkShowRedesignWelcome = () => !hasSeenRedesignWelcome && navigation.navigate('redesignWelcome')
  return checkShowRedesignWelcome
}
