export const isPaymentTooLate = (
  contract: Pick<Contract, "paymentMade" | "paymentExpectedBy">,
) =>
  !contract.paymentMade &&
  (contract.paymentExpectedBy?.getTime() || 0) < Date.now();
