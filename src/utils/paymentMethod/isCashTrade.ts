import { PaymentMethod } from "../../../peach-api/src/@types/payment";

export const isCashTrade = (
  paymentMethod: PaymentMethod,
): paymentMethod is CashPaymentMethds => paymentMethod.startsWith("cash");
