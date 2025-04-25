import { isIOS } from "./isIOS";
import { toggleNotificationsAndroid } from "./toggleNotificationsAndroid";
import { toggleNotificationsIOS } from "./toggleNotificationsIOS";

export const toggleNotifications = () => {
  if (isIOS()) {
    toggleNotificationsIOS();
  } else {
    toggleNotificationsAndroid();
  }
};
