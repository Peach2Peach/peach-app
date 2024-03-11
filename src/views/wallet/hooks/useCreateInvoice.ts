import { receivePayment } from "@breeztech/react-native-breez-sdk";
import { useCallback, useState } from "react";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { parseError } from "../../../utils/parseError";

export const useCreateInvoice = ({
  amountMsat,
  description,
}: {
  amountMsat: number;
  description: string;
}) => {
  const showErrorBanner = useShowErrorBanner();
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [invoice, setInvoice] = useState<string>();
  const createInvoice = useCallback(async () => {
    setIsCreatingInvoice(true);
    try {
      const receivePaymentResponse = await receivePayment({
        amountMsat,
        description,
      });

      setInvoice(receivePaymentResponse.lnInvoice.bolt11);
    } catch (e) {
      showErrorBanner(parseError(e));
    } finally {
      setIsCreatingInvoice(false);
    }
  }, [amountMsat, description, showErrorBanner]);

  return { invoice, createInvoice, isCreatingInvoice };
};
