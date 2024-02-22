import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { error } from "../../utils/log/error";
import { info } from "../../utils/log/info";
import { parseError } from "../../utils/parseError";

export const useHandleNotifications = (
  messageHandler: (message: FirebaseMessagingTypes.RemoteMessage) => void,
) => {
  useEffect(() => {
    info("Subscribe to push notifications");
    try {
      const unsubscribe = messaging().onMessage(messageHandler);

      return unsubscribe;
    } catch (e) {
      error(
        "messaging().onMessage - Push notifications not supported",
        parseError(e),
      );
      return () => null;
    }
  }, [messageHandler]);
};
