import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSetToast } from "../components/toast/Toast";
import { APPVERSION, BUILDNUMBER } from "../constants";
import i18n from "../utils/i18n";
import { peachAPI } from "../utils/peachAPI";
import { compatibilityCheck } from "../utils/system/compatibilityCheck";
import { linkToAppStore } from "../utils/system/linkToAppStore";
import { systemKeys } from "../views/addPaymentMethod/usePaymentMethodInfo";

export const useShowUpdateAvailable = () => {
  const setToast = useSetToast();
  const { data } = useQuery({
    queryKey: systemKeys.version(),
    queryFn: async () => {
      const { result } = await peachAPI.public.system.getVersion();
      if (result) return result;
      throw new Error("Could not fetch version");
    },
  });

  useEffect(() => {
    if (!data) return;
    const { latestAppVersion, minAppVersion } = data;
    if (!compatibilityCheck(`${APPVERSION} ${BUILDNUMBER}`, latestAppVersion)) {
      if (!compatibilityCheck(`${APPVERSION} ${BUILDNUMBER}`, minAppVersion)) {
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
      } else {
        setToast({
          msgKey: "UPDATE_AVAILABLE",
          color: "yellow",
          keepAlive: true,
          action: {
            onPress: linkToAppStore,
            label: i18n("download"),
            iconId: "download",
          },
        });
      }
    }
  }, [data, setToast]);
};
