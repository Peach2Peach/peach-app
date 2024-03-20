import { hasMopsConfigured } from "../../../utils/offer/hasMopsConfigured";
import { isValidPaymentData } from "../../../utils/paymentMethod/isValidPaymentData";

export const validatePaymentMethods = ({
  originalPaymentData,
  meansOfPayment,
}: Pick<
  BuyOfferDraft | SellOfferDraft,
  "originalPaymentData" | "meansOfPayment"
>) =>
  hasMopsConfigured(meansOfPayment) &&
  originalPaymentData.every(isValidPaymentData);
