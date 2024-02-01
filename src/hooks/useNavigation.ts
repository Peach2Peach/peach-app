import { useNavigation as useDefaultNavigation } from "@react-navigation/native";
import { StackNavigation } from "../utils/navigation/handlePushNotification";

export const useNavigation = () => useDefaultNavigation<StackNavigation>();
