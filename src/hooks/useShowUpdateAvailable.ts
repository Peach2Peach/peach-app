import { useEffect } from "react";
import { useSetToast } from "../components/toast/Toast";
import { BUILDNUMBER } from "../constants";
import i18n from "../utils/i18n";
import { linkToAppStore } from "../utils/system/linkToAppStore";
import { useAppVersion } from "./useAppVersion";

export const useShowUpdateAvailable = () => {
  const setToast = useSetToast();
  const { data } = useAppVersion();

  useEffect(() => {
    if (!data) return;
    const { minBuildNumber } = data;

    if (minBuildNumber && Number(BUILDNUMBER) < Number(minBuildNumber)) {
      setToast({
        msgKey: "CRITICAL_UPDATE_AVAILABLE",
        color: "red",
        keepAlive: true,
        action: {
          onPress: linkToAppStore,
          label: i18n("download"),
          iconId: "download",
        },
      });
    }

    // if (!compatibilityCheck(`${APPVERSION} ${BUILDNUMBER}`, latestAppVersion)) {
    //   if (!compatibilityCheck(`${APPVERSION} ${BUILDNUMBER}`, minAppVersion)) {
    //     setToast({
    //       msgKey: "CRITICAL_UPDATE_AVAILABLE",
    //       color: "red",
    //       keepAlive: true,
    //       action: {
    //         onPress: linkToAppStore,
    //         label: i18n("download"),
    //         iconId: "download",
    //       },
    //     });
    //   } else {
    //     setToast({
    //       msgKey: "UPDATE_AVAILABLE",
    //       color: "yellow",
    //       keepAlive: true,
    //       action: {
    //         onPress: linkToAppStore,
    //         label: i18n("download"),
    //         iconId: "download",
    //       },
    //     });
    //   }
    // }
  }, [data, setToast]);
};
