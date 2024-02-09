import { PAYMENTCATEGORIES } from "../../paymentMethods";

const ANONYMOUS_PAYMENTCATEGORIES = PAYMENTCATEGORIES.cash.concat(
  PAYMENTCATEGORIES.giftCard,
);

export const isLimitReached = (
  exceedsLimit: (keyof TradingLimit)[],
  selectedPaymentMethod?: PaymentMethod,
) => {
  if (exceedsLimit.includes("daily") || exceedsLimit.includes("yearly")) {
    return true;
  }
  if (
    exceedsLimit.includes("monthlyAnonymous") &&
    selectedPaymentMethod &&
    ANONYMOUS_PAYMENTCATEGORIES.includes(selectedPaymentMethod)
  ) {
    return true;
  }

  return false;
};
