import { signAndEncrypt } from "../../../utils/pgp/signAndEncrypt";

export type TradeDetails = {
  /** public key (user id) of the buyer making the trade request */
  buyer: string;
  /** public key (user id) of the owner of the sell offer */
  seller: string;
  offerId: number;
  paymentMethod: string;
  /** amount in sats */
  amount: string;
  /** price in the selected currency */
  price: number;
  /** premium of the sell offer, in percent */
  premium: number;
  currency: string;
};

/**
 * Serializes the trade details, encrypts them to the seller's PGP keys and
 * signs the plaintext with the buyer's (self) PGP private key.
 * Keys are listed explicitly so the serialized field order is stable.
 */
export const createEncryptedTradeDetails = async (
  details: TradeDetails,
  sellerPgpPublicKeys: { publicKey: string }[],
) => {
  if (sellerPgpPublicKeys.length === 0)
    throw Error("Seller has no PGP public keys");

  const plaintext = JSON.stringify({
    buyer: details.buyer,
    seller: details.seller,
    offerId: details.offerId,
    paymentMethod: details.paymentMethod,
    amount: details.amount,
    price: details.price,
    premium: details.premium,
    currency: details.currency,
  });

  const { encrypted, signature } = await signAndEncrypt(
    plaintext,
    sellerPgpPublicKeys.map((pgp) => pgp.publicKey).join("\n"),
  );

  return {
    encryptedTradeDetails: encrypted,
    encryptedTradeDetailsBuyerSignature: signature,
  };
};
