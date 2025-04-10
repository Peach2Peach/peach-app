import {
  getBundleId,
  getInstallerPackageNameSync,
} from "react-native-device-info";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { getLocalizedLink } from "../web/getLocalizedLink";
import { openURL } from "../web/openURL";

export const linkToAppStoreAndroid = () => {
  const bundleId = getBundleId();
  const isInstalledByGooglePlay =
    getInstallerPackageNameSync() === "com.android.vending";
  return openURL(
    isInstalledByGooglePlay
      ? `https://play.google.com/store/apps/details?id=${bundleId}`
      : getLocalizedLink("apk", useSettingsStore.getState().locale),
  );
};
