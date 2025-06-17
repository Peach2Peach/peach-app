import { useQuery } from "@tanstack/react-query";
import { tradeRequestKeys } from "../../hooks/query/tradeRequestKeys";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";

export const useDecryptedTradeRequestData = (
  offerId: string,
  requestingUserId: string,
  symmetricKeyEncrypted: string,
) =>
  useQuery({
    queryKey: tradeRequestKeys.decryptedData(offerId, requestingUserId),
    queryFn: async () => {
      const symmetricKey = await decryptSymmetricKey(symmetricKeyEncrypted);
      if (!symmetricKey)
        throw new Error("Could not decrypt trade request data");

      return { symmetricKey };
    },
    retry: false,
  });
