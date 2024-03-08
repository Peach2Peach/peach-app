import { sendPayment } from "@breeztech/react-native-breez-sdk";
import bolt11 from "bolt11";
import { useCallback, useState } from "react";

type PayInvoiceProps = {
  paymentRequest?: ReturnType<typeof bolt11.decode>;
  amount?: number;
};
export const usePayInvoice = ({ paymentRequest, amount }: PayInvoiceProps) => {
  const [isPayingInvoice, setIsPayingInvoice] = useState(false);

  const payInvoice = useCallback(async () => {
    if (!paymentRequest) throw Error("INVOICE_MISSING");
    const amountMsat = paymentRequest.millisatoshis
      ? Number(paymentRequest.millisatoshis)
      : amount;
    if (!paymentRequest.paymentRequest) throw Error("INVOICE_MISSING");
    if (!amountMsat) throw Error("AMOUNT_MISSING");
    setIsPayingInvoice(true);
    const response = await sendPayment({
      bolt11: paymentRequest.paymentRequest,
      amountMsat: paymentRequest.millisatoshis ? undefined : amount,
    });
    setIsPayingInvoice(false);

    return response.payment;
  }, [amount, paymentRequest]);

  return { payInvoice, isPayingInvoice };
};
