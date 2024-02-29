import crashlytics from "@react-native-firebase/crashlytics";
import { SESSION_ID } from "../../constants";
import { isProduction } from "../system/isProduction";

export const info = (...args: unknown[]) => {
  if (isProduction()) {
    crashlytics().log([new Date(), SESSION_ID, "INFO", ...args].join(" - "));
  } else {
    console.info([new Date(), SESSION_ID, "INFO", ...args].join(" - "));
  }
};
