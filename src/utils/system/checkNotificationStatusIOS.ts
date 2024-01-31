import messaging from "@react-native-firebase/messaging";
import { error } from "../log/error";
import { parseError } from "../result/parseError";

/**
 * @description Method to check if app is allowed to receive push notifications on iOS
 * @returns true if notifications are enabled
 */
export const checkNotificationStatusIOS = async (): Promise<boolean> => {
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
