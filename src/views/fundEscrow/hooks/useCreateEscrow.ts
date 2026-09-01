import { useMutation } from "@tanstack/react-query";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { createEscrowForOffer } from "../../../utils/offer/createEscrowForOffer";
import { parseError } from "../../../utils/parseError";

export const useCreateEscrow = () => {
  const showErrorBanner = useShowErrorBanner();

  return useMutation({
    mutationFn: (offerIds: string[]) =>
      Promise.all(offerIds.map((offerId) => createEscrowForOffer({ offerId }))),
    onError: (err) => showErrorBanner(parseError(err)),
  });
};
