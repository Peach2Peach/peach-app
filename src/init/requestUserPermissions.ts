import * as RNFS from "@dr.pogodin/react-native-fs";
import messaging from "@react-native-firebase/messaging";
import { isAirplaneModeSync } from "react-native-device-info";
import { openCrashReportPrompt } from "../utils/analytics/openCrashReportPrompt";
import { deleteFile } from "../utils/file/deleteFile";
import { readFile } from "../utils/file/readFile";
import { error } from "../utils/log/error";
import { info } from "../utils/log/info";
import { parseError } from "../utils/parseError";

export const requestUserPermissions = async () => {
  info("Requesting notification permissions");

  try {
    const authStatus = await messaging().requestPermission({
      alert: true,
      badge: false,
      sound: true,
    });
    info("Permission status:", authStatus);
  } catch (e) {
    error(
      "messaging().requestPermission - Push notifications not supported",
      parseError(e),
    );
  }

  if (
    !isAirplaneModeSync() &&
    (await RNFS.exists(`${RNFS.DocumentDirectoryPath}/error.log`))
  ) {
    const errorQueue = await readFile("/error.log");
    openCrashReportPrompt(
      errorQueue.split("\n").map((e: string) => new Error(e)),
    );
    await deleteFile("/error.log");
  }
};
