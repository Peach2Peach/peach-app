import { dataToMeansOfPayment } from "../../../utils/paymentMethod/dataToMeansOfPayment";
import { getPaymentMethodInfo } from "../../../utils/paymentMethod/getPaymentMethodInfo";

export const getMeansOfPayment = (paymentData: PaymentData[]) =>
  paymentData
    .filter((data) => !!getPaymentMethodInfo(data.type))
    .reduce(dataToMeansOfPayment, {});
