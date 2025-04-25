import { isIOS } from "./isIOS";
import { linkToAppStoreAndroid } from "./linkToAppStoreAndroid";
import { linkToAppStoreIOS } from "./linkToAppStoreIOS";

export const linkToAppStore = async () => {
  if (isIOS()) {
    await linkToAppStoreIOS();
  } else {
    await linkToAppStoreAndroid();
  }
};
