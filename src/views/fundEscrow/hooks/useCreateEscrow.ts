import { useMutation } from "@tanstack/react-query";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { parseError } from "../../../utils/parseError";
import { peachAPI } from "../../../utils/peachAPI";
import { getPublicKeyForEscrow } from "../../../utils/wallet/getPublicKeyForEscrow";
import { getWallet } from "../../../utils/wallet/getWallet";

export const useCreateEscrow = () => {
  const showErrorBanner = useShowErrorBanner();

  return useMutation({
    mutationFn: (offerIds: string[]) =>
      Promise.all(offerIds.map(createEscrowFn)),
    onError: (err) => showErrorBanner(parseError(err)),
  });
};

async function createEscrowFn(offerId: string) {
  const publicKey = getPublicKeyForEscrow(getWallet(), offerId);

  const { result, error: err } = await peachAPI.private.offer.createEscrow({
    offerId,
    publicKey,
  });

  if (err) throw new Error(err.error);
  return result;
}
