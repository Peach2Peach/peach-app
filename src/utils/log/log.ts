import crashlytics from "@react-native-firebase/crashlytics";
import { SESSION_ID } from "../../constants";
import { isProduction } from "../system/isProduction";

export const log = (...args: unknown[]) => {
  if (isProduction()) {
    crashlytics().log([new Date(), SESSION_ID, "LOG", ...args].join(" - "));
  } else {
    console.log([new Date(), SESSION_ID, "LOG", ...args].join(" - "));
  }
};
