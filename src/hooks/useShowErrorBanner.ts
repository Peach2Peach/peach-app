import { useCallback } from "react";
import { useSetToast } from "../components/toast/Toast";
import i18n from "../utils/i18n";
import { error } from "../utils/log/error";
import { parseError } from "../utils/result/parseError";
import { useNavigation } from "./useNavigation";

export const useShowErrorBanner = () => {
  const navigation = useNavigation();
  const setToast = useSetToast();

  const showErrorBanner = useCallback(
    (err?: Error | string | null, bodyArgs?: string[]) => {
      error("Error", err);
      setToast({
        msgKey: err ? parseError(err) : "GENERAL_ERROR",
        bodyArgs,
        color: "red",
        action: {
          onPress: () => navigation.navigate("contact"),
          label: i18n("contactUs"),
          iconId: "mail",
        },
      });
    },
    [navigation, setToast],
  );

  return showErrorBanner;
};
