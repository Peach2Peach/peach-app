import ecc from "@bitcoinerlab/secp256k1";
import { address as addressUtils, crypto } from "bitcoinjs-lib";
import { getMessageToSignForAddress } from "../account/getMessageToSignForAddress";
import { isValidBitcoinSignature } from "../validation/isValidBitcoinSignature";
import { getNetwork } from "../wallet/getNetwork";

/** bech32/bech32m addresses are case-insensitive: compare them in lowercase,
 * as the server does when building the message. Others are kept as they are. */
export const normalizeAddress = (address: string) => {
  try {
    addressUtils.fromBech32(address);
    return address.toLowerCase();
  } catch {
    return address;
  }
};

const isValidPeachUserSignature = (
  message: string,
  buyerId: string,
  peachUserSignature: string,
) => {
  try {
    return ecc.verify(
      crypto.sha256(Buffer.from(message, "utf8")),
      Buffer.from(buyerId, "hex"),
      Buffer.from(peachUserSignature, "hex"),
    );
  } catch {
    return false;
  }
};

type Props = {
  /** set by the server: only then are the proofs checked */
  mustValidate?: boolean;
  /** the buyer's Peach ID public key */
  buyerId?: string;
  releaseAddress?: string;
  releaseAddressMessageSignature?: string;
  peachUserSignature?: string;
};

/**
 * @description checks the buyer vouched for the release address in both
 * directions before the seller confirms the payment: the address key signed
 * for the buyer's Peach ID, and the buyer's Peach ID key signed for the address.
 * Runs only when the server sets `mustValidateBuyerReleaseProofs`; then a
 * missing proof fails the same way as one that doesn't verify, with
 * INVALID_RELEASE_ADDRESS_SIGNATURE.
 */
export const verifyBuyerReleaseAddress = ({
  mustValidate,
  buyerId,
  releaseAddress,
  releaseAddressMessageSignature,
  peachUserSignature,
}: Props) => {
  if (mustValidate !== true) return;
  if (
    !buyerId ||
    !releaseAddress ||
    !releaseAddressMessageSignature ||
    !peachUserSignature
  )
    throw new Error("INVALID_RELEASE_ADDRESS_SIGNATURE");

  const address = normalizeAddress(releaseAddress);
  const message = getMessageToSignForAddress(buyerId, address);

  const addressSignatureValid = isValidBitcoinSignature({
    message,
    address,
    signature: releaseAddressMessageSignature,
    network: getNetwork(),
  });
  if (
    !addressSignatureValid ||
    !isValidPeachUserSignature(message, buyerId, peachUserSignature)
  ) {
    throw new Error("INVALID_RELEASE_ADDRESS_SIGNATURE");
  }
};
