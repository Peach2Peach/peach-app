import { useState } from "react";
import { WebViewMessageEvent } from "react-native-webview";
import { SwapInfo, useBoltzSwapStore } from "../../../store/useBoltzSwapStore";
import { log } from "../../log/log";
import { peachAPI } from "../../peachAPI";

export const useRefundSubmarineSwap = ({ swap }: { swap: SwapInfo }) => {
  const [error, setError] = useState<string>();
  const saveSwap = useBoltzSwapStore((state) => state.saveSwap);
  const handleRefundMessage = async (event: WebViewMessageEvent) => {
    log("useRefundSubmarineSwap - handleRefundMessage");

    const data = JSON.parse(event.nativeEvent.data);
    log("useRefundSubmarineSwap - handleRefundMessage", JSON.stringify(data));
    if (data.error) {
      setError(data.error);
      return;
    }

    if (data.tx) {
      log("useRefundSubmarineSwap - handleRefundMessage ", data.tx);
      const { result, error: err } = await peachAPI.public.liquid.postTx({
        tx: data.tx,
      });

      if (err) {
        setError(err.details);
        if (err.details.includes("bad-txns-inputs-missingorspent")) {
          // when it's spent it's most likely refunded
          saveSwap({
            ...swap,
            status: { ...swap.status, status: "transaction.refunded" },
          });
        }

        return;
      }
      if (!result) {
        setError("GENERAL_ERROR");
      } else {
        saveSwap({
          ...swap,
          status: { ...swap.status, status: "transaction.refunded" },
        });
      }
    }
  };

  return { handleRefundMessage, error };
};
