import messaging from "@react-native-firebase/messaging";
import { Linking } from "react-native";

export const toggleNotificationsIOS = async () => {
  const authStatus = await messaging().hasPermission();
  if (authStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
    await messaging().requestPermission({
      alert: true,
      badge: false,
      sound: true,
    });
  } else {
    await Linking.openSettings();
  }
};
