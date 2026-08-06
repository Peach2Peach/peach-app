import { useMutation } from "@tanstack/react-query";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { parseError } from "../../../utils/parseError";
import { peachAPI } from "../../../utils/peachAPI";
import { getPublicKeyForEscrow } from "../../../utils/wallet/getPublicKeyForEscrow";
import { getWallet } from "../../../utils/wallet/getWallet";
import { deriveTaprootEscrow } from "../../../utils/wallet/taprootEscrow/deriveTaprootEscrow";
import { isTaprootAddress } from "../../../utils/wallet/taprootEscrow/isTaprootEscrow";

type CreateEscrowResult = Awaited<
  ReturnType<typeof peachAPI.private.offer.createEscrow>
>["result"];

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
  verifyTaprootEscrow(result, publicKey);

  return result;
}

/**
 * @description a taproot (escrow version 2) escrow is a 2-of-2 between the
 * seller and Peach, so the address must be derived and verified locally before
 * anything is sent to it
 */
function verifyTaprootEscrow(
  result: CreateEscrowResult,
  sellerPublicKey: string,
) {
  const escrowAddress = result?.escrows?.bitcoin ?? result?.escrow;
  if (!result || !isTaprootAddress(escrowAddress)) return;

  const peachPublicKey = result.escrowPeachPublicKey?.bitcoin;
  const { expiry } = result.funding;
  if (!peachPublicKey || !expiry) {
    throw new Error("ESCROW_NOT_VERIFIABLE");
  }

  const escrow = deriveTaprootEscrow({
    sellerPublicKey: Buffer.from(sellerPublicKey, "hex"),
    peachPublicKey: Buffer.from(peachPublicKey, "hex"),
    expiry,
  });
  // the funding screen sends to `escrow`, so that is the address that has to
  // match the verified one
  if (escrow.address !== escrowAddress || escrow.address !== result.escrow) {
    throw new Error("ESCROW_ADDRESS_MISMATCH");
  }
}
