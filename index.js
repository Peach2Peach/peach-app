import Notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { AppRegistry, LogBox } from "react-native";
import "./shim.js";
import { App } from "./src/App";
import { name as appName } from "./src/app.json";
import { error } from "./src/utils/log/error";
import { info } from "./src/utils/log/info";
import { parseError } from "./src/utils/parseError";
import { isProduction } from "./src/utils/system/isProduction";

LogBox.ignoreAllLogs(isProduction());

try {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    info("Message handled in the background!", remoteMessage);
    if (isIOS())
      await Notifee.setBadgeCount((await Notifee.getBadgeCount()) + 1);
  });
} catch (e) {
  error(
    "messaging().setBackgroundMessageHandler - Push notifications not supported",
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
