const isRequired = ["noPayment.buyer", "noPayment.seller"];

export const isEmailRequiredForDispute = (reason: DisputeReason | "") =>
  isRequired.includes(reason);
