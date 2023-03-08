export const sortContractsByDate = (a: TradeSummary, b: TradeSummary) => {
  const dateA = a.paymentConfirmed || a.paymentMade || a.creationDate
  const dateB = b.paymentConfirmed || b.paymentMade || b.creationDate
  if (dateA.getTime() === dateB.getTime()) return 0
  return dateA.getTime() > dateB.getTime() ? 1 : -1
}
