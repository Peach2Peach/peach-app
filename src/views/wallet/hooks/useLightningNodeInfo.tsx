import { nodeInfo } from "@breeztech/react-native-breez-sdk";
import { useQuery } from "@tanstack/react-query";

export const useLightningNodeInfo = () =>
  useQuery({
    queryKey: ["wallet", "lightning", "info"],
    queryFn: nodeInfo,
  });
