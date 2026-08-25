import { hasSuspiciousIBAN } from "./hasSuspiciousIBAN";
import { paymentDataMatchesHashes } from "./paymentDataMatchesHashes";

/**
 * Decides whether the counterparty's decrypted payment data should be shown as
 * suspicious: either it no longer matches the hashes published on the contract,
 * or it carries an IBAN that never came out of this app's payment data flow.
 */
export const isSuspiciousPaymentData = (
  paymentData: PaymentData | undefined,
  storedHashes: string[],
) =>
  !!paymentData &&
  (!paymentDataMatchesHashes(paymentData, storedHashes) ||
    hasSuspiciousIBAN(paymentData));
