import { isIOS } from "./isIOS";
import { toggleNotificationsAndroid } from "./toggleNotificationsAndroid";
import { toggleNotificationsIOS } from "./toggleNotificationsIOS";

export const toggleNotifications = async () => {
  if (isIOS()) {
    await toggleNotificationsIOS();
  } else {
    await toggleNotificationsAndroid();
  }
};
