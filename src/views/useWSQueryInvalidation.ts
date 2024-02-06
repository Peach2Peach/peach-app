import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { z } from "zod";
import { useWebsocketContext } from "../utils/peachAPI/websocket";
const queryUpdateEventSchema = z.object({
  event: z.literal("dataStale"),
  data: z.array(z.any()),
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
        await queryClient.invalidateQueries({ queryKey: data });
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
