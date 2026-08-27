import { signAndEncrypt } from "../pgp/signAndEncrypt";
import { cleanPaymentData } from "./cleanPaymentData";
import { hashPaymentData } from "./hashPaymentData";

type Params = {
  /** the payment data entries selected for this offer */
  originalPaymentData: PaymentData[];
  /** own pgp public key, used for the selfEncrypted copy */
  myPgpPubKey: string;
  /** peach pgp public key, only used when the offer allows instant trades */
  peachPGPPublicKey?: string;
  instantTrade: boolean;
};

/**
 * Builds the `paymentData` payload of an offer at submit time.
 *
 * The hashes are derived from the very same cleaned object that gets
 * encrypted, so the hashes published with an offer can never describe
 * different details than the encrypted payment data does.
 */
export const buildOfferPaymentData = async ({
  originalPaymentData,
  myPgpPubKey,
  peachPGPPublicKey,
  instantTrade,
}: Params): Promise<OfferPaymentData> => {
  const entries = await Promise.all(
    originalPaymentData.map(async (data) => {
      const details = cleanPaymentData(data);

      const [selfEncrypted, peachEncrypted] = await Promise.all([
        signAndEncrypt(JSON.stringify(details), myPgpPubKey),
        instantTrade && peachPGPPublicKey
          ? signAndEncrypt(JSON.stringify(details), peachPGPPublicKey)
          : undefined,
      ]);

      return [
        data.type,
        {
          hashes: hashPaymentData(details).map((item) => item.hash),
          // backwards compatibility for original PMs
          country: details.iban
            ? (details.iban.slice(0, 2) as PaymentMethodCountry)
            : data.country,
          isMpesa: Boolean(data.isMpesa || details.mpesa_name),
          ...(peachEncrypted && {
            encrypted: peachEncrypted.encrypted,
            signature: peachEncrypted.signature,
          }),
          selfEncrypted: selfEncrypted.encrypted,
          selfEncryptedSignature: selfEncrypted.signature,
        },
      ] as const;
    }),
  );

  return entries.reduce(
    (obj: OfferPaymentData, [type, offerPaymentData]) => ({
      ...obj,
      [type]: offerPaymentData,
    }),
    {},
  );
};
