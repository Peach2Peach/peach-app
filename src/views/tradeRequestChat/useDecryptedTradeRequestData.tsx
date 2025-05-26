import { useQuery } from "@tanstack/react-query";
import OpenPGP from "react-native-fast-openpgp";
import { Contract, TradeRequest } from "../../../peach-api/src/@types/contract";
import { PublicUser } from "../../../peach-api/src/@types/user";
import { tradeRequestKeys } from "../../hooks/query/offerKeys";
import { decrypt } from "../../utils/pgp/decrypt";
import { decryptSymmetric } from "../../utils/pgp/decryptSymmetric";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";

export const useDecryptedTradeRequestData = (tradeRequest: TradeRequest) => {
  return useQuery({
    queryKey: tradeRequestKeys.decryptedData(
      tradeRequest.offerId,
      tradeRequest.userId
        ? tradeRequest.userId
        : tradeRequest.requestingUserId
          ? tradeRequest.requestingUserId
          : tradeRequest.user.id,
    ),
    queryFn: async () => {
      const { symmetricKey } = await decryptTradeRequestData(tradeRequest);
      if (!symmetricKey)
        throw new Error("Could not decrypt trade request data");

      return { symmetricKey };
    },
    retry: true,
  });
};

async function decryptTradeRequestData(tradeRequest: TradeRequest) {
  const symmetricKey = await decryptSymmetricKey(
    tradeRequest.symmetricKeyEncrypted,
  );

  return { symmetricKey };
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
