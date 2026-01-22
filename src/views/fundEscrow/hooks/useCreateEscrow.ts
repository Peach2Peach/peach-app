import { useMutation } from "@tanstack/react-query";
import { AddressIndex } from "bdk-rn/lib/lib/enums";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { parseError } from "../../../utils/parseError";
import { peachAPI } from "../../../utils/peachAPI";
import { getPublicKeyForEscrow } from "../../../utils/wallet/getPublicKeyForEscrow";
import { getWallet } from "../../../utils/wallet/getWallet";
import { peachWallet } from "../../../utils/wallet/setWallet";

export const useCreateEscrow = ({
  isSellOffer = false,
}: {
  isSellOffer?: boolean;
}) => {
  const showErrorBanner = useShowErrorBanner();

  return useMutation({
    mutationFn: (offerIds: string[]) =>
      Promise.all(
        offerIds.map((x) => {
          createEscrowFn(x, !isSellOffer);
        }),
      ),
    onError: (err) => showErrorBanner(parseError(err)),
  });
};

async function createEscrowFn(offerId: string, generateReturnAddress: boolean) {
  const publicKey = getPublicKeyForEscrow(getWallet(), offerId);

  let returnAddress: string | undefined = undefined;
  if (generateReturnAddress) {
    if (!peachWallet) {
      throw Error("Peach Wallet not Ready");
    }

    const getAddressResult = await peachWallet?.getAddress(
      AddressIndex.LastUnused,
      "internal",
    );

    returnAddress = getAddressResult.address;
  }

  const { result, error: err } = await peachAPI.private.offer.createEscrow({
    offerId,
    publicKey,
    returnAddress,
  });

  if (err) throw new Error(err.error);
  return result;
}
