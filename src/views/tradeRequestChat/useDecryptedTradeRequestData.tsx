import { useQuery } from "@tanstack/react-query";
import OpenPGP from "react-native-fast-openpgp";
import { Contract } from "../../../peach-api/src/@types/contract";
import { decrypt } from "../../utils/pgp/decrypt";
import { decryptSymmetric } from "../../utils/pgp/decryptSymmetric";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";

export const useDecryptedTradeRequestData = (offer: BuyOffer | SellOffer) =>
  useQuery({
    queryKey: offerKeys.decryptedData(offer.id),
    queryFn: async () => {
      const { symmetricKey, paymentData } = await decryptOfferData(offer);
      if (!symmetricKey || !paymentData)
        throw new Error("Could not decrypt contract data");

      return { symmetricKey, paymentData };
    },
    retry: false,
  });

async function decryptOfferData(offer: Offer) {
  const symmetricKey = await decryptSymmetricKey(offer.symmetricKeyEncrypted);

  const paymentData = await decryptPaymentData(
    {
      paymentDataEncrypted: contract.paymentDataEncrypted,
      paymentDataSignature: contract.paymentDataSignature,
      user: contract.seller,
      paymentDataEncryptionMethod: contract.paymentDataEncryptionMethod,
    },
    symmetricKey,
  );

  return { symmetricKey, paymentData };
}

async function hasValidSignature({
  signature,
  message,
  publicKeys,
}: {
  publicKeys: { publicKey: string }[];
  signature: string;
  message: string;
}) {
  const someSignatureIsValid = (
    await Promise.all(
      publicKeys.map(async ({ publicKey }) => {
        try {
          return await OpenPGP.verify(signature, message, publicKey);
        } catch (e) {
          return false;
        }
      }),
    )
  ).some(Boolean);

  return someSignatureIsValid;
}

type DecryptPaymentDataProps = Pick<Contract, "paymentDataEncryptionMethod"> & {
  paymentDataEncrypted: string;
  paymentDataSignature: string;
  user: PublicUser;
};
async function decryptPaymentData(
  {
    paymentDataEncrypted,
    paymentDataSignature,
    user,
    paymentDataEncryptionMethod,
  }: DecryptPaymentDataProps,
  symmetricKey: string | null,
) {
  if (!paymentDataEncrypted || !paymentDataSignature) {
    throw new Error("MISSING_PAYMENT_DATA_SECRETS");
  }

  const verifySignature = (decryptedString: string) =>
    hasValidSignature({
      signature: paymentDataSignature,
      message: decryptedString,
      publicKeys: user.pgpPublicKeys,
    });

  if (paymentDataEncryptionMethod === "asymmetric") {
    try {
      const decryptedPaymentDataString = await decrypt(paymentDataEncrypted);
      if (!(await verifySignature(decryptedPaymentDataString))) {
        throw new Error("PAYMENT_DATA_SIGNATURE_INVALID");
      }
      const decryptedPaymentData = JSON.parse(
        decryptedPaymentDataString,
      ) as PaymentData;
      return decryptedPaymentData;
    } catch (e) {
      throw new Error("ASYMMETRIC_PAYMENT_DATA_ENCRYPTION_FAILED");
    }
  }
  if (!symmetricKey) {
    throw new Error("MISSING_SYMMETRIC_KEY");
  }

  try {
    const decryptedPaymentDataString = await decryptSymmetric(
      paymentDataEncrypted,
      symmetricKey,
    );
    if (!(await verifySignature(decryptedPaymentDataString))) {
      throw new Error("PAYMENT_DATA_SIGNATURE_INVALID");
    }
    const decryptedPaymentData = JSON.parse(
      decryptedPaymentDataString,
    ) as PaymentData;
    return decryptedPaymentData;
  } catch (e) {
    throw new Error("SYMMETRIC_PAYMENT_DATA_ENCRYPTION_FAILED");
  }
}
