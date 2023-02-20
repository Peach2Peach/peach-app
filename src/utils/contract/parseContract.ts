export const parseContract = (contract: Contract): Contract => {
  const parsed = { ...contract }

  parsed.creationDate = new Date(parsed.creationDate)
  parsed.lastModified = new Date(parsed.lastModified)
  if (parsed.buyer?.creationDate) parsed.buyer.creationDate = new Date(parsed.buyer.creationDate)
  if (parsed.seller?.creationDate) parsed.seller.creationDate = new Date(parsed.seller.creationDate)
  if (parsed.kycResponseDate) parsed.kycResponseDate = new Date(parsed.kycResponseDate)
  if (parsed.paymentMade) parsed.paymentMade = new Date(parsed.paymentMade)
  if (parsed.paymentConfirmed) parsed.paymentConfirmed = new Date(parsed.paymentConfirmed)
  if (parsed.disputeDate) parsed.disputeDate = new Date(parsed.disputeDate)
  if (parsed.disputeResolvedDate) parsed.disputeResolvedDate = new Date(parsed.disputeResolvedDate)
  if (parsed.paymentExpectedBy) parsed.paymentExpectedBy = new Date(parsed.paymentExpectedBy)
  return parsed
}
