import { useQuery } from "@tanstack/react-query";
import { matchChatKeys } from "../../hooks/query/offerKeys";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";

export const useDecryptedMatchData = (
  offerId: string,
  matchingUserId: string,
  symmetricKeyEncrypted: string,
) =>
  useQuery({
    queryKey: matchChatKeys.decryptedData(offerId, matchingUserId),
    queryFn: async () => {
      const symmetricKey = await decryptSymmetricKey(symmetricKeyEncrypted);
      if (!symmetricKey) throw new Error("Could not decrypt match data");

      return { symmetricKey };
    },
    retry: false,
  });
