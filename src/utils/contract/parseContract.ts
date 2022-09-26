/**
 * @description Method to parse contract data into a usable format
 * @param contract contract to parse
 * @returns parsed contract
 */
export const parseContract = (contract: Contract): Contract => {
  contract.creationDate = new Date(contract.creationDate)
  contract.buyer.creationDate = new Date(contract.buyer.creationDate)
  contract.seller.creationDate = new Date(contract.seller.creationDate)

  if (contract.kycResponseDate) contract.kycResponseDate = new Date(contract.kycResponseDate)
  if (contract.paymentMade) contract.paymentMade = new Date(contract.paymentMade)
  if (contract.paymentConfirmed) contract.paymentConfirmed = new Date(contract.paymentConfirmed)
  if (contract.disputeDate) contract.disputeDate = new Date(contract.disputeDate)
  if (contract.disputeResolvedDate) contract.disputeResolvedDate = new Date(contract.disputeResolvedDate)

  return contract
}
