import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "../../hooks/query/chatKeys";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";
import { useSymmetricKeyEncrypted } from "./useSymmetricKeyEncrypted";

export function useSymmetricKey(
  offerType: "buyOffer" | "sellOffer",
  chatRoomId: string,
) {
  const { data: symmetricKeyEncrypted } = useSymmetricKeyEncrypted(
    offerType,
    chatRoomId,
    0,
  );
  return useQuery({
    queryKey: chatKeys.symmetricKey(symmetricKeyEncrypted),
    queryFn: async () => {
      if (!symmetricKeyEncrypted)
        throw new Error("No symmetric key encrypted found");
      const symmetricKey = await decryptSymmetricKey(symmetricKeyEncrypted);
      if (!symmetricKey) throw new Error("Could not decrypt symmetric key");

      return symmetricKey;
    },
    retry: false,
    enabled: !!symmetricKeyEncrypted,
  });
}
