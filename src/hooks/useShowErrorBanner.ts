import { useCallback } from "react";
import { useSetToast } from "../components/toast/Toast";
import i18n from "../utils/i18n";
import { error } from "../utils/log/error";
import { parseError } from "../utils/parseError";
import { parseErrorDetails } from "../utils/parseErrorDetails";
import { isExpectedMixnetBlackhole } from "../utils/wallet/nym/nymGate";
import { useStackNavigation } from "./useStackNavigation";

/**
 * someone who may not create offers can still take the other side's offers,
 * so point them there instead of to support
 */
const SEE_OFFERS_SCREEN: Record<
  string,
  "expressSellBrowseBuyOffers" | "expressBuyBrowseSellOffers" | undefined
> = {
  SELLING_NOT_ALLOWED: "expressSellBrowseBuyOffers",
  BUYING_NOT_ALLOWED: "expressBuyBrowseSellOffers",
};

export const useShowErrorBanner = () => {
  const navigation = useStackNavigation();
  const setToast = useSetToast();

  const showErrorBanner = useCallback(
    (err?: Error | string | null, bodyArgs?: string[]) => {
      const msgKey = err ? parseError(err) : "GENERAL_ERROR";
      // Suppress expected network failures while the mixnet blackholes traffic
      // during connect (fail-closed) — its own connecting/failed toast owns it.
      if (isExpectedMixnetBlackhole(msgKey)) return;

      // error("Error", err);
      // errors thrown with `new Error(msg, { cause: details })` carry the
      // details the API sent along, e.g. which fields were invalid
      const details = err instanceof Error ? parseErrorDetails(err.cause) : "";
      // log the message rather than the Error itself: `error` opens the crash
      // report prompt for Error instances, and the banner already informs the user
      error(
        "Error",
        [err instanceof Error ? err.message : err, details]
          .filter(Boolean)
          .join(" - "),
      );
      const offersScreen = SEE_OFFERS_SCREEN[msgKey];
      setToast({
        msgKey,
        bodyArgs: bodyArgs ?? [details],
        color: "red",
        action: offersScreen
          ? {
              onPress: () => navigation.navigate(offersScreen),
              label: i18n("seeOffers"),
              iconId: "search",
            }
          : {
              onPress: () =>
                navigation.navigate("contact", { errorMessage: err }),
              label: i18n("contactUs"),
              iconId: "mail",
            },
      });
    },
    [navigation, setToast],
  );

  return showErrorBanner;
};
