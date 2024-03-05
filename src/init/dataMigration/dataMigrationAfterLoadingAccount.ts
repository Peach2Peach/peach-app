import { PAYMENTMETHODINFOS } from "../../paymentMethods";
import { checkSupportedPaymentMethods } from "./afterLoadingAccount/checkSupportedPaymentMethods";

export const dataMigrationAfterLoadingAccount = () => {
  checkSupportedPaymentMethods(PAYMENTMETHODINFOS);
};
