import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { setUnhandledPromiseRejectionTracker } from "react-native-promise-rejection-utils";
import { useSetPopup } from "./components/popup/GlobalPopup";
import { useSetToast } from "./components/toast/Toast";
import { useHandleNotifications } from "./hooks/notifications/useHandleNotifications";
import { useMessageHandler } from "./hooks/notifications/useMessageHandler";
import { useShouldShowBackupReminder } from "./hooks/useShouldShowBackupReminder";
import { useShowUpdateAvailable } from "./hooks/useShowUpdateAvailable";
import { useStackNavigation } from "./hooks/useStackNavigation";
import { useInitialNavigation } from "./init/useInitialNavigation";
import { AnalyticsPopup } from "./popups/AnalyticsPopup";
import { VerifyYouAreAHumanPopup } from "./popups/warning/VerifyYouAreAHumanPopup";
import { useSettingsStore } from "./store/settingsStore/useSettingsStore";
import i18n, { useI18n } from "./utils/i18n";
import { error } from "./utils/log/error";
import { parseError } from "./utils/parseError";
import { useUpdateUser } from "./utils/peachAPI/useUpdateUser";
import { isNetworkError } from "./utils/system/isNetworkError";

export const useGlobalHandlers = () => {
  useI18n();
  const messageHandler = useMessageHandler();
  const analyticsPopupSeen = useSettingsStore(
    (state) => state.analyticsPopupSeen,
  );

  useShouldShowBackupReminder();
  useInitialNavigation();
  useShowUpdateAvailable();
  useHandleNotifications(messageHandler);

  const setPopup = useSetPopup();
  const setAnalyticsPopupSeen = useSettingsStore(
    (state) => state.setAnalyticsPopupSeen,
  );
  const setToast = useSetToast();
  const navigation = useStackNavigation();

  ErrorUtils.setGlobalHandler((err: Error) => {
    error(err);
    setToast({
      msgKey: err.message || "GENERAL_ERROR",
      color: "red",
      action: {
        onPress: () => navigation.navigate("contact", { errorMessage: err }),
        label: i18n("contactUs"),
        iconId: "mail",
      },
    });
  });

  setUnhandledPromiseRejectionTracker((id, err) => {
    error(err);
    const errorMessage = parseError(err);

    if (errorMessage === "HUMAN_VERIFICATION_REQUIRED") {
      setPopup(<VerifyYouAreAHumanPopup />);
      return;
    }
    const errorMsgKey = isNetworkError(errorMessage)
      ? "NETWORK_ERROR"
      : errorMessage;
    setToast({
      msgKey: errorMsgKey || "GENERAL_ERROR",
      color: "red",
      action: {
        onPress: () =>
          navigation.navigate("contact", { errorMessage: errorMessage }),
        label: i18n("contactUs"),
        iconId: "mail",
      },
    });
  });

  if (!analyticsPopupSeen && useSettingsStore.persist?.hasHydrated()) {
    setPopup(<AnalyticsPopup />);
    setAnalyticsPopupSeen(true);
  }

  const { mutate: updateUser } = useUpdateUser();
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh((fcmToken) => {
      updateUser({ fcmToken });
    });
    return () => unsubscribe();
  }, [updateUser]);
};
