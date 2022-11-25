import { RouteProp, useRoute } from '@react-navigation/native'

export const useSearchRoute = () => useRoute<RouteProp<{ params: RootStackParamList['search'] }>>()
