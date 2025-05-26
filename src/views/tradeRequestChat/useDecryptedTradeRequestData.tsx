import { useQuery } from "@tanstack/react-query";
import { TradeRequest } from "../../../peach-api/src/@types/contract";
import { tradeRequestKeys } from "../../hooks/query/offerKeys";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";

export const useDecryptedTradeRequestData = (tradeRequest: TradeRequest) =>
  useQuery({
    queryKey: tradeRequestKeys.decryptedData(
      tradeRequest.offerId,
      tradeRequest.userId
        ? tradeRequest.userId
        : tradeRequest.requestingUserId
          ? tradeRequest.requestingUserId
          : tradeRequest.user.id,
    ),
    queryFn: async () => {
      const { symmetricKey } = await decryptTradeRequestData(tradeRequest);
      if (!symmetricKey)
        throw new Error("Could not decrypt trade request data");

      return { symmetricKey };
    },
    retry: true,
  });

async function decryptTradeRequestData(tradeRequest: TradeRequest) {
  const symmetricKey = await decryptSymmetricKey(
    tradeRequest.symmetricKeyEncrypted,
  );

  return { symmetricKey };
}
