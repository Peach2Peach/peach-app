import { NETWORK } from "@env";
import { BIP32Interface } from "bip32";

/**
 * @description dedicated, seed-recoverable key of a Buy Offer. Buy and sell
 * offer ids are independent, so this must stay off the sell escrow branches.
 */
export const getBuyOfferWallet = (
  wallet: BIP32Interface,
  buyOfferId: string,
) =>
  wallet.derivePath(
    `m/84'/${NETWORK === "bitcoin" ? "0" : "1"}'/0'/55'/4/${buyOfferId}`,
  );
