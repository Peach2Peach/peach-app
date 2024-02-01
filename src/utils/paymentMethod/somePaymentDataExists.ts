import { keys } from "../object/keys";
import { cleanPaymentData } from "./cleanPaymentData";
import { isCashTrade } from "./isCashTrade";

export const somePaymentDataExists = (data: PaymentData) =>
  isCashTrade(data.type) ||
  keys(cleanPaymentData(data)).some((key) => data[key]);
