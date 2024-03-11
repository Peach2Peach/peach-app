import { paymentByHash } from "@breeztech/react-native-breez-sdk";
import { useQuery } from "@tanstack/react-query";
import bolt11 from "bolt11";
import { MSINASECOND } from "../../../constants";

const REFETCH_INTERVAL = 5;
export const useLightningPayment = ({ invoice }: { invoice: string }) =>
  useQuery({
    queryKey: ["wallet", "lightning", "payment", invoice],
    queryFn: async () => {
      const hash = bolt11
        .decode(invoice)
        .tags.find((tag) => tag.tagName === "payment_hash")?.data;
      if (!hash) throw Error("NO_PREIMAGE_HASH");
      const payment = await paymentByHash(String(hash));
      if (!payment) throw Error("PAYMENT_NOT_FOUND");
      return payment;
    },
    refetchInterval: MSINASECOND * REFETCH_INTERVAL,
  });
