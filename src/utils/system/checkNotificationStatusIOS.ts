import messaging from "@react-native-firebase/messaging";
import { error } from "../log/error";
import { parseError } from "../parseError";

export const checkNotificationStatusIOS = async () => {
  try {
    const authStatus = await messaging().hasPermission();
    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      return true;
    }
  } catch (e) {
    error(
      "messaging().hasPermission - Push notifications not supported",
      parseError(e),
    );
  }

  return false;
};
