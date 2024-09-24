import { Contract } from "../../../../peach-api/src/@types/contract";

export const isPaymentTooLate = ({
  paymentMade,
  paymentExpectedBy,
}: Pick<Contract, "paymentMade" | "paymentExpectedBy">) =>
  !paymentMade && (paymentExpectedBy?.getTime() || 0) < Date.now();
