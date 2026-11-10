import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { useCallback } from "react";
import { AppState } from "react-native";
import { useSetToast } from "../../components/toast/Toast";
import { refundBuyerOnlyEscrow } from "../../utils/contract/refundBuyerOnlyEscrow";
import { error } from "../../utils/log/error";
import { info } from "../../utils/log/info";
import { parseError } from "../../utils/parseError";
import { useOnBuyerRefunded } from "../useAutoRefundBuyerOnlyEscrows";
import { useOfferPopupEvents } from "./eventHandler/offer/useOfferPopupEvents";
import { useOverlayEvents } from "./eventHandler/useOverlayEvents";
import { useGetPNActionHandler } from "./useGetPNActionHandler";

export const useMessageHandler = () => {
  const setToast = useSetToast();
  const getPNActionHandler = useGetPNActionHandler();
  const overlayEvents = useOverlayEvents();
  const offerPopupEvents = useOfferPopupEvents();
  const onBuyerRefunded = useOnBuyerRefunded();

  const onMessageHandler = useCallback(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      info(`A new FCM message arrived! ${JSON.stringify(remoteMessage)}`);
      if (!remoteMessage.data) return;

      const data = remoteMessage.data as unknown as PNData;
      const { type } = data;
      if (!type) return;

      // sign right away; refundBuyerOnlyEscrow checks the refund is really due
      if (type === "contract.buyer.refundRequired" && data.contractId) {
        const { contractId } = data;
        refundBuyerOnlyEscrow(contractId)
          .then((result) => {
            if (result === "refunded") onBuyerRefunded(contractId);
          })
          .catch((e) =>
            error("[autoBuyerRefund] failed", contractId, parseError(e)),
          );
      }

      if (overlayEvents[type]) {
        overlayEvents[type]?.(data);
      } else if (
        AppState.currentState === "active" &&
        type !== "contract.chat"
      ) {
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification?.messageId === remoteMessage.messageId) return;
        if (offerPopupEvents[type]) {
          offerPopupEvents[type]?.(data, remoteMessage.notification);
        } else if (type === "custom") {
          setToast({
            msgKey: type,
            title: remoteMessage.notification?.title,
            message: remoteMessage.notification?.body,
            color: "yellow",
          });
        } else {
          setToast({
            msgKey: `notification.${type}`,
            bodyArgs: remoteMessage.notification?.bodyLocArgs,
            color: "yellow",
            action: getPNActionHandler(data),
          });
        }
      }
    },
    [
      getPNActionHandler,
      offerPopupEvents,
      onBuyerRefunded,
      overlayEvents,
      setToast,
    ],
  );
  return onMessageHandler;
};
