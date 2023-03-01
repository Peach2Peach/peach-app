import { useNavigation } from '.'
import { useConfigStore } from '../store/configStore'
import shallow from 'zustand/shallow'

export const useCheckShowRedesignWelcome = () => {
  const navigation = useNavigation()
  const [hasSeenRedesignWelcome] = useConfigStore((state) => [state.hasSeenRedesignWelcome], shallow)

  const checkShowRedesignWelcome = () => !hasSeenRedesignWelcome && navigation.navigate('redesignWelcome')
  return checkShowRedesignWelcome
}
