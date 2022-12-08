import { useNavigation as useDefaultNavigation } from '@react-navigation/native'
import { StackNavigation } from '../utils/navigation'

export const useNavigation = () => useDefaultNavigation<StackNavigation>()
