import { useConfigStore } from "../../store/configStore/configStore";
import { checkSupportedPaymentMethods } from "./afterLoadingAccount/checkSupportedPaymentMethods";

export const dataMigrationAfterLoadingAccount = async () => {
  await checkSupportedPaymentMethods(useConfigStore.getState().paymentMethods);
};
