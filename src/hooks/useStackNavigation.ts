import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../utils/navigation/handlePushNotification";

export const useStackNavigation = () => useNavigation<StackNavigation>();
