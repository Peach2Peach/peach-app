import { sendPayment } from "@breeztech/react-native-breez-sdk";
import bolt11 from "bolt11";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

const isPayingInvoiceAtom = atom(false);
export const useSetIsPayingInvoice = () => useSetAtom(isPayingInvoiceAtom);

type PayInvoiceProps = {
  paymentRequest?: ReturnType<typeof bolt11.decode>;
  amount?: number;
};
export const usePayInvoice = ({ paymentRequest, amount }: PayInvoiceProps) => {
  const isPayingInvoice = useAtomValue(isPayingInvoiceAtom);
  const setIsPayingInvoice = useSetIsPayingInvoice();
  const payInvoice = useCallback(async () => {
    if (!paymentRequest) throw Error("INVOICE_MISSING");
    const amountMsat = paymentRequest.millisatoshis
      ? Number(paymentRequest.millisatoshis)
      : amount;
    if (!paymentRequest.paymentRequest) throw Error("INVOICE_MISSING");
    if (!amountMsat) throw Error("AMOUNT_MISSING");
    setIsPayingInvoice(true);
    try {
      const response = await sendPayment({
        bolt11: paymentRequest.paymentRequest,
        amountMsat: paymentRequest.millisatoshis ? undefined : amount,
      });
      return response.payment;
    } finally {
      setIsPayingInvoice(false);
    }
  }, [amount, paymentRequest, setIsPayingInvoice]);

  return { payInvoice, isPayingInvoice };
};
