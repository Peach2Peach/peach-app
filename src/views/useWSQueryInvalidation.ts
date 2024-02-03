import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { z } from "zod";
import { contractKeys } from "../hooks/query/useContractDetail";
import { bitcoinQueryKeys } from "../hooks/query/useFeeEstimate";
import { esploraKeys } from "../hooks/query/useFeeEstimates";
import { marketKeys } from "../hooks/query/useMarketPrices";
import { eventKeys } from "../hooks/query/useMeetupEvents";
import { offerKeys } from "../hooks/query/useOfferDetail";
import { userKeys } from "../hooks/query/useSelfUser";
import { useWebsocketContext } from "../utils/peachAPI/websocket";
import { systemKeys } from "./addPaymentMethod/useFormFields";
import { matchesKeys } from "./search/hooks/useOfferMatches";
import { walletKeys } from "./wallet/hooks/useUTXOs";

const queryUpdateEventSchema = z.object({
  event: z.literal("dataStale"),
  data: z.object({
    entity: z.array(z.any()),
  }),
});

export function useWSQueryInvalidation() {
  const queryClient = useQueryClient();
  const websocket = useWebsocketContext();

  const queryMessageHandler = useCallback(
    async (message: unknown) => {
      const parsedMessage = queryUpdateEventSchema.safeParse(message);
      if (!parsedMessage.success) {
        return;
      }
      const { data, event } = parsedMessage.data;
      if (event === "dataStale") {
        await queryClient.invalidateQueries({ queryKey: data.entity });
      }
    },
    [queryClient],
  );

  useEffect(() => {
    const unsubscribe = () => {
      websocket.off("message", queryMessageHandler);
    };

    if (!websocket.connected) return unsubscribe;

    websocket.on("message", queryMessageHandler);

    return () => {
      unsubscribe();
    };
  }, [queryClient, queryMessageHandler, websocket]);
}
