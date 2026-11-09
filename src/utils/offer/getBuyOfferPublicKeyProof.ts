import { BIP32Interface } from "bip32";
import { sha256 } from "bitcoinjs-lib/src/crypto";
import { signMessageWithWallet } from "../account/signMessageWithWallet";
import { getBuyOfferWallet } from "../wallet/getBuyOfferWallet";

export const getBuyOfferPublicKeyProof = (
  wallet: BIP32Interface,
  userId: string,
  buyOfferId: string,
) => {
  const buyOfferWallet = getBuyOfferWallet(wallet, buyOfferId);
  const publicKey = buyOfferWallet.publicKey.toString("hex");

  return {
    publicKey,
    userSignature: signMessageWithWallet(
      `I confirm that I, ${userId}, own the public key ${publicKey}`,
      wallet,
    ),
    publicKeySignature: buyOfferWallet
      .sign(
        sha256(
          Buffer.from(
            `I confirm that the public key ${publicKey} belongs to the user ${userId}`,
          ),
        ),
      )
      .toString("hex"),
  };
};
