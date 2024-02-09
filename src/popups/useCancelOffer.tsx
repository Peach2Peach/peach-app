import { useMutation } from "@tanstack/react-query";
import { peachAPI } from "../utils/peachAPI";

export function useCancelOffer() {
  return useMutation({
    mutationFn: async (offerId: string) => {
      const { result, error } = await peachAPI.private.offer.cancelOffer({
        offerId,
      });
      if (!result) {
        throw new Error(error?.error || "COULD_NOT_CANCEL_OFFER");
      }
      return result;
    },
  });
}
