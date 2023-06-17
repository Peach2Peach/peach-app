import { getPaymentMethodInfo, dataToMeansOfPayment } from '../../../utils/paymentMethod'

export const getMeansOfPayment = (paymentData: PaymentData[]) =>
  paymentData.filter((data) => !!getPaymentMethodInfo(data.type)).reduce(dataToMeansOfPayment, {})
