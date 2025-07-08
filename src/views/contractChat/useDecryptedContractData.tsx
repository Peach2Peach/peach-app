import { useQuery } from "@tanstack/react-query";
import { contractKeys } from "../../hooks/query/useContractDetail";
import { decrypt } from "../../utils/pgp/decrypt";
import { decryptSymmetric } from "../../utils/pgp/decryptSymmetric";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";
import { hasValidSignature } from "../contract/helpers/hasValidSignature";

export const useDecryptedContractData = (contract: Contract) =>
  useQuery({
    queryKey: contractKeys.decryptedData(contract.id),
    queryFn: async () => {
      const { symmetricKey, paymentData, buyerPaymentData } =
        await decryptContractData(contract);
      if (!symmetricKey || !paymentData || !buyerPaymentData)
        throw new Error("Could not decrypt contract data");

      return { symmetricKey, paymentData, buyerPaymentData };
    },
    retry: false,
  });

async function decryptContractData(contract: Contract) {
  const symmetricKey = await decryptSymmetricKey(
    contract.symmetricKeyEncrypted,
    contract.symmetricKeySignature,
    [...contract.buyer.pgpPublicKeys, ...contract.seller.pgpPublicKeys],
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

  const buyerPaymentData = await decryptPaymentData(
    {
      paymentDataEncrypted: contract.buyerPaymentDataEncrypted,
      paymentDataSignature: contract.buyerPaymentDataSignature,
      user: contract.buyer,
      paymentDataEncryptionMethod: "aes256",
    },
    symmetricKey,
  );

  return { symmetricKey, paymentData, buyerPaymentData };
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
