export const isPaymentTooLate = (
  contract: Pick<Contract, "paymentMade" | "paymentExpectedBy">,
) =>
  !contract.paymentMade &&
  contract.paymentExpectedBy &&
  contract.paymentExpectedBy?.getTime() < Date.now();
