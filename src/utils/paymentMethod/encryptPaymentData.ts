import { signAndEncryptSymmetric } from "../pgp/signAndEncryptSymmetric";

export const encryptPaymentData = (
  paymentData: PaymentDataInfo,
  symmetricKey: string,
) => signAndEncryptSymmetric(JSON.stringify(paymentData), symmetricKey);
