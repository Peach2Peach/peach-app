import { checkNotificationStatusIOS } from "./checkNotificationStatusIOS";
import { checkNotificationStatusAndroid } from "./checkNotificationStatusAndroid";
import { isIOS } from "./isIOS";

export const checkNotificationStatus = () =>
  isIOS() ? checkNotificationStatusIOS() : checkNotificationStatusAndroid();
