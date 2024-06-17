import { useCallback } from "react";
import { error } from "../../../utils/log/error";
import { useSetToast } from "../../toast/Toast";
import { useTranslate } from "@tolgee/react";

const colors: Record<string, "yellow"> = {
  NOT_FOUND: "yellow",
  CANNOT_DOUBLEMATCH: "yellow",
};

export const useHandleError = () => {
  const setToast = useSetToast();
  const { t } = useTranslate("error");

  const handleError = useCallback(
    (err: APIError | null) => {
      error("Error", err);
      if (err?.error) {
        const msgKey = err?.error === "NOT_FOUND" ? "OFFER_TAKEN" : err?.error;
        setToast({
          msgKey:
            msgKey ||
            t("error.general", ((err?.details as string[]) || []).join(", ")),
          color: colors[err?.error] || "red",
        });
      }
    },
    [setToast, t],
  );

  return handleError;
};
