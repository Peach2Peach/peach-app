import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { useNavigationState } from "@react-navigation/native";
import { useCallback } from "react";
import { AppState } from "react-native";
import { useSetToast } from "../../components/toast/Toast";
import { info } from "../../utils/log/info";
import { useOfferPopupEvents } from "./eventHandler/offer/useOfferPopupEvents";
import { useOverlayEvents } from "./eventHandler/useOverlayEvents";
import { useStateUpdateEvents } from "./eventHandler/useStateUpdateEvents";
import { useGetPNActionHandler } from "./useGetPNActionHandler";

export const useMessageHandler = () => {
  const setToast = useSetToast();
  const currentPage = useNavigationState(
    (state) => state?.routes[state.index].name,
  );
  const getPNActionHandler = useGetPNActionHandler();
  const overlayEvents = useOverlayEvents();
  const offerPopupEvents = useOfferPopupEvents();
  const stateUpdateEvents = useStateUpdateEvents();

  const onMessageHandler = useCallback(
    (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      info(
        `A new FCM message arrived! ${JSON.stringify(remoteMessage)}`,
        `currentPage ${currentPage}`,
      );
      if (!remoteMessage.data) return;

      const data = remoteMessage.data as unknown as PNData;
      const { type } = data;
      if (!type) return;

      if (overlayEvents[type]) {
        overlayEvents[type]?.(data);
      } else if (offerPopupEvents[type]) {
        offerPopupEvents[type]?.(data, remoteMessage.notification);
      } else if (stateUpdateEvents[type]) {
        stateUpdateEvents[type]?.(data);
      } else if (AppState.currentState === "active") {
        setToast({
          msgKey: `notification.${type}`,
          bodyArgs: remoteMessage.notification?.bodyLocArgs,
          color: "yellow",
          action: getPNActionHandler(data),
        });
      }
    },
    [
      currentPage,
      getPNActionHandler,
      offerPopupEvents,
      overlayEvents,
      stateUpdateEvents,
      setToast,
    ],
  );
  return onMessageHandler;
};
