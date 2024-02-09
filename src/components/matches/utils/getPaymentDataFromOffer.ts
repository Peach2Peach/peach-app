import { buildPaymentDataFromHashes } from "./buildPaymentDataFromHashes";

export function getPaymentDataFromOffer(
  offer: BuyOffer | SellOffer,
  paymentMethod: PaymentMethod,
) {
  const hashes = offer.paymentData[paymentMethod]?.hashes;
  if (!hashes) return { error: "MISSING_HASHED_PAYMENT_DATA" } as const;

  const paymentData = buildPaymentDataFromHashes(hashes, paymentMethod);
  if (!paymentData) return { error: "MISSING_PAYMENTDATA" } as const;
  return { paymentData } as const;
}
