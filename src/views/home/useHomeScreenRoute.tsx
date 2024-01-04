import { RouteProp, useRoute as useNativeRoute } from '@react-navigation/native'

export const useHomeScreenRoute = <T extends keyof HomeTabParamList>() =>
  useNativeRoute<RouteProp<HomeTabParamList, T>>()
