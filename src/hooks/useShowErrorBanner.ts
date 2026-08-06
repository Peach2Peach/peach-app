import { useCallback } from "react";
import { useSetToast } from "../components/toast/Toast";
import i18n from "../utils/i18n";
import { error } from "../utils/log/error";
import { parseError } from "../utils/parseError";
import { parseErrorDetails } from "../utils/parseErrorDetails";
import { useStackNavigation } from "./useStackNavigation";

export const useShowErrorBanner = () => {
  const navigation = useStackNavigation();
  const setToast = useSetToast();

  const showErrorBanner = useCallback(
    (err?: Error | string | null, bodyArgs?: string[]) => {
      error("Error", err);
      // errors thrown with `new Error(msg, { cause: details })` carry the
      // details the API sent along, e.g. which fields were invalid
      const details = err instanceof Error ? parseErrorDetails(err.cause) : "";
      setToast({
        msgKey: err ? parseError(err) : "GENERAL_ERROR",
        bodyArgs: bodyArgs ?? [details],
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
