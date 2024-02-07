import { useQuery } from "@tanstack/react-query";
import { error } from "../../utils/log/error";
import { decrypt } from "../../utils/pgp/decrypt";
import { decryptSymmetric } from "../../utils/pgp/decryptSymmetric";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";
import { hasValidSignature } from "../contract/helpers/hasValidSignature";

export const useDecryptedContractData = (contract?: Contract) =>
  useQuery({
    queryKey: ["contract", contract?.id, "decrytedData"],
    queryFn: async () => {
      if (!contract) throw new Error("No contract provided");
      const { symmetricKey, paymentData } = await decryptContractData(contract);
      if (!symmetricKey || !paymentData)
        throw new Error("Could not decrypt contract data");

      return { symmetricKey, paymentData };
    },
    enabled: !!contract,
  });

async function decryptContractData(contract: Contract) {
  const symmetricKey = await decryptSymmetricKey(
    contract.symmetricKeyEncrypted,
    contract.symmetricKeySignature,
    contract.buyer.pgpPublicKeys,
  );

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
    return logAndThrow(new Error("MISSING_PAYMENT_DATA_SECRETS"));
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
        return logAndThrow(new Error("PAYMENT_DATA_SIGNATURE_INVALID"));
      }
      const decryptedPaymentData = JSON.parse(
        decryptedPaymentDataString,
      ) as PaymentData;
      return decryptedPaymentData;
    } catch (e) {
      return logAndThrow(
        new Error("ASYMMETRIC_PAYMENT_DATA_ENCRYPTION_FAILED"),
      );
    }
  }
  if (!symmetricKey) {
    return logAndThrow(new Error("MISSING_SYMMETRIC_KEY"));
  }

  try {
    const decryptedPaymentDataString = await decryptSymmetric(
      paymentDataEncrypted,
      symmetricKey,
    );
    if (!(await verifySignature(decryptedPaymentDataString))) {
      return logAndThrow(new Error("PAYMENT_DATA_SIGNATURE_INVALID"));
    }
    const decryptedPaymentData = JSON.parse(
      decryptedPaymentDataString,
    ) as PaymentData;
    return decryptedPaymentData;
  } catch (e) {
    return logAndThrow(new Error("SYMMETRIC_PAYMENT_DATA_ENCRYPTION_FAILED"));
  }
}

function logAndThrow(err: Error) {
  error(err);
  throw err;
}
