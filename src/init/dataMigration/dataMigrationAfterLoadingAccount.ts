import { useConfigStore } from "../../store/configStore/configStore";
import { checkSupportedPaymentMethods } from "./afterLoadingAccount/checkSupportedPaymentMethods";

export const dataMigrationAfterLoadingAccount = () => {
  checkSupportedPaymentMethods(useConfigStore.getState().paymentMethods);
};
