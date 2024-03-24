import { listPayments } from "@breeztech/react-native-breez-sdk";
import { useQuery } from "@tanstack/react-query";

export const useLightningPayments = () =>
  useQuery({
    queryKey: ["wallet", "lightning", "payments"],
    queryFn: () => listPayments({}),
    initialData: [],
  });
