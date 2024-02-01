import {
  RouteProp,
  useRoute as useNativeRoute,
} from "@react-navigation/native";

export const useRoute = <T extends keyof RootStackParamList>() =>
  useNativeRoute<RouteProp<RootStackParamList, T>>();
