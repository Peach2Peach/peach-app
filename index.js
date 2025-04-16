import messaging from "@react-native-firebase/messaging";
import { AppRegistry, LogBox } from "react-native";
import { increment } from "rn-notification-badge";
import "./shim.js";
import { App } from "./src/App";
import { name as appName } from "./src/app.json";
import { error } from "./src/utils/log/error";
import { info } from "./src/utils/log/info";
import { parseError } from "./src/utils/parseError";
import { isIOS } from "./src/utils/system/isIOS";
import { isProduction } from "./src/utils/system/isProduction";

LogBox.ignoreAllLogs(isProduction());

try {
  // eslint-disable-next-line require-await
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    info("Message handled in the background!", remoteMessage);
    if (isIOS()) increment();
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
    void navigator.serviceWorker.register("/service-worker.js");
  }
}
