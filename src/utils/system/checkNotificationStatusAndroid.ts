import { checkNotifications } from "react-native-permissions";

/**
 * @description Method to check if app is allowed to receive push notifications on Android
 * @returns true if notifications are enabled
 */
export const checkNotificationStatusAndroid = async (): Promise<boolean> => {
  const { status } = await checkNotifications();
  if (status === "granted") {
    return true;
  }

  return false;
};
