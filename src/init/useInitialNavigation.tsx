import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { useCallback, useEffect } from "react";
import { useSetGlobalOverlay } from "../Overlay";
import { useStackNavigation } from "../hooks/useStackNavigation";
import { error } from "../utils/log/error";
import { info } from "../utils/log/info";
import { handlePushNotification } from "../utils/navigation/handlePushNotification";
import { parseError } from "../utils/parseError";
import { isDefined } from "../utils/validation/isDefined";
import { NewBadge } from "../views/overlays/NewBadge";
import { EscrowOfContractFunded } from "../views/search/EscrowOfContractFunded";
import { OfferPublished } from "../views/search/OfferPublished";

const dataIsDefined = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): remoteMessage is FirebaseMessagingTypes.RemoteMessage & {
  data: {
    [key: string]: string;
  };
} => !!remoteMessage.data;

export const useInitialNavigation = () => {
  const navigation = useStackNavigation();
  const setOverlay = useSetGlobalOverlay();

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
      if (remoteMessage.data.type === "contract.escrowFunded") {
        setOverlay(
          <EscrowOfContractFunded
            contractId={remoteMessage.data.contractId}
            shouldGoBack
          />,
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
