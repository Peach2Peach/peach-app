export const isKYCConfirmationRequired = (contract: Contract) =>
  contract.kycRequired && contract.kycResponseDate === null
