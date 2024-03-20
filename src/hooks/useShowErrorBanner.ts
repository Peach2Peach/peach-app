import { useCallback } from "react";
import { useSetToast } from "../components/toast/Toast";
import { error } from "../utils/log/error";
import { parseError } from "../utils/parseError";
import { useStackNavigation } from "./useStackNavigation";
import { useTranslate } from "@tolgee/react";

export const useShowErrorBanner = () => {
  const navigation = useStackNavigation();
  const setToast = useSetToast();
  const { t } = useTranslate();

  const showErrorBanner = useCallback(
    (err?: Error | string | null, bodyArgs?: string[]) => {
      error("Error", err);
      setToast({
        msgKey: err ? parseError(err) : "GENERAL_ERROR",
        bodyArgs,
        color: "red",
        action: {
          onPress: () => navigation.navigate("contact"),
          label: t("contactUs"),
          iconId: "mail",
        },
      });
    },
    [navigation, setToast, t],
  );

  return showErrorBanner;
};
