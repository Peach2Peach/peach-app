import { useCallback } from "react";
import { useSetToast } from "../components/toast/Toast";
import i18n from "../utils/i18n";
import { error } from "../utils/log/error";
import { parseError } from "../utils/parseError";
import { isExpectedMixnetBlackhole } from "../utils/wallet/nym/nymGate";
import { useStackNavigation } from "./useStackNavigation";

export const useShowErrorBanner = () => {
  const navigation = useStackNavigation();
  const setToast = useSetToast();

  const showErrorBanner = useCallback(
    (err?: Error | string | null, bodyArgs?: string[]) => {
      error("Error", err);
      const msgKey = err ? parseError(err) : "GENERAL_ERROR";
      // Suppress expected network failures while the mixnet blackholes traffic
      // during connect (fail-closed) — its own connecting/failed toast owns it.
      if (isExpectedMixnetBlackhole(msgKey)) return;
      setToast({
        msgKey,
        bodyArgs,
        color: "red",
        action: {
          onPress: () => navigation.navigate("contact", { errorMessage: err }),
          label: i18n("contactUs"),
          iconId: "mail",
        },
      });
    },
    [navigation, setToast],
  );

  return showErrorBanner;
};
