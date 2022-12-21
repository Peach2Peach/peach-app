export const isKYCRequired = (contract: Contract) =>
  contract.kycRequired && !contract.kycConfirmed && contract.kycResponseDate === null
