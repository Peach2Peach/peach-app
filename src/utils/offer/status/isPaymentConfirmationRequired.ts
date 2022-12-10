export const isPaymentConfirmationRequired = (contract: Contract) =>
  contract.paymentMade !== null && !contract.paymentConfirmed
