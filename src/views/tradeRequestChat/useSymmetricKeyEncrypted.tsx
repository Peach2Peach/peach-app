import { useQuery } from "@tanstack/react-query";
import { MSINASECOND, TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { chatKeys } from "../../hooks/query/chatKeys";
import { peachAPI } from "../../utils/peachAPI";

export function useSymmetricKeyEncrypted(
  offerType: "buyOffer" | "sellOffer",
  chatRoomId: string,
) {
  return useQuery({
    queryKey: chatKeys.symmetricKeyEncrypted(offerType, chatRoomId),
    queryFn: async ({ queryKey }) => {
      const { result, error } =
        await peachAPI.private.offer.getSymmetricKeyEncryptedForTradeRequestChat(
          {
            offerType: queryKey[2],
            chatRoomId: queryKey[3],
          },
        );

      if (error) throw new Error(error.error);

      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * MSINASECOND,
  });
}
