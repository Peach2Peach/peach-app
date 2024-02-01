import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { useCallback, useEffect } from "react";
import { useSetOverlay } from "../Overlay";
import { useNavigation } from "../hooks/useNavigation";
import { error } from "../utils/log/error";
import { info } from "../utils/log/info";
import { handlePushNotification } from "../utils/navigation/handlePushNotification";
import { parseError } from "../utils/result/parseError";
import { isDefined } from "../utils/validation/isDefined";
import { NewBadge } from "../views/overlays/NewBadge";
import { OfferPublished } from "../views/search/OfferPublished";

const dataIsDefined = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): remoteMessage is FirebaseMessagingTypes.RemoteMessage & {
  data: {
    [key: string]: string;
  };
} => !!remoteMessage.data;

export const useInitialNavigation = () => {
  const navigation = useNavigation();
  const setOverlay = useSetOverlay();

  const handleOverlays = useCallback(
    (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage & {
        data: { [key: string]: string };
      },
    ) => {
      if (isDefined(remoteMessage.data.badges)) {
        setOverlay(
          <NewBadge badges={remoteMessage.data.badges.split(",") as Medal[]} />,
        );
        return true;
      }
      if (remoteMessage.data.type === "offer.escrowFunded") {
        setOverlay(
          <OfferPublished offerId={remoteMessage.data.offerId} shouldGoBack />,
        );
        return true;
      }
      return false;
    },
    [setOverlay],
  );

  const handleNotification = useCallback(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      if (dataIsDefined(remoteMessage)) {
        if (handleOverlays(remoteMessage)) return;
        await handlePushNotification(navigation, remoteMessage);
      }
    },
    [handleOverlays, navigation],
  );

  const initialNavigation = useCallback(async () => {
    let initialNotification: FirebaseMessagingTypes.RemoteMessage | null = null;
    try {
      initialNotification = await messaging().getInitialNotification();
    } catch (e) {
      error(
        "messaging().getInitialNotification - Push notifications not supported",
        parseError(e),
      );
    }

    if (initialNotification) {
      info(
        "Notification caused app to open from quit state:",
        JSON.stringify(initialNotification),
      );

      await handleNotification(initialNotification);
    }

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      info(
        "Notification caused app to open from background state:",
        JSON.stringify(remoteMessage),
      );

      await handleNotification(remoteMessage);
    });
  }, [handleNotification]);

  useEffect(() => {
    initialNavigation();
  }, [initialNavigation]);
};
