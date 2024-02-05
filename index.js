import NotificationBadge from "@msml/react-native-notification-badge";
import messaging from "@react-native-firebase/messaging";
import { AppRegistry, LogBox } from "react-native";
import "./shim.js";
import { App } from "./src/App";
import { name as appName } from "./src/app.json";
import { error } from "./src/utils/log/error";
import { info } from "./src/utils/log/info";
import { parseError } from "./src/utils/result/parseError";
import { isIOS } from "./src/utils/system/isIOS";
import { isProduction } from "./src/utils/system/isProduction";
import { useNotificationStore } from "./src/views/home/notificationsStore";

LogBox.ignoreAllLogs(isProduction());

try {
  // eslint-disable-next-line require-await
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const notifs = useNotificationStore.getState().notifications + 1;

    if (isIOS()) NotificationBadge.setNumber(notifs);
    useNotificationStore.getState().setNotifications(notifs);

    info("Message handled in the background!", remoteMessage);
  });
} catch (e) {
  error(
    "messaging().setBackgroundMessageHandler/onTokenRefresh - Push notifications not supported",
    parseError(e),
  );
}

AppRegistry.registerComponent(appName, () => App);

if (typeof document !== "undefined") {
  // start webapp if document available
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById("root"),
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
  }
}
