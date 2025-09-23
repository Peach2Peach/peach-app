import { useCallback } from "react";
import i18n from "../../../utils/i18n";
import { error } from "../../../utils/log/error";
import { useSetToast } from "../../toast/Toast";

const colors: Record<string, "yellow"> = {
  NOT_FOUND: "yellow",
  CANNOT_DOUBLEMATCH: "yellow",
  TRADING_LIMIT_OF_COUNTERPARTY_REACHED: "yellow",
};

export const useHandleError = () => {
  const setToast = useSetToast();

  const handleError = useCallback(
    (err: APIError | null) => {
      error("Error", err);
      if (err?.error) {
        const msgKey = err?.error === "NOT_FOUND" ? "OFFER_TAKEN" : err?.error;
        console.log("msgKey", msgKey);
        setToast({
          msgKey:
            msgKey ||
            i18n(
              "error.general",
              ((err?.details as string[]) || []).join(", "),
            ),
          color: colors[err?.error] || "red",
        });
      }
    },
    [setToast],
  );

  return handleError;
};
