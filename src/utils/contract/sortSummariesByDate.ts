export const sortSummariesByDate = (
  a: Pick<TradeSummary, 'paymentMade' | 'creationDate'>,
  b: Pick<TradeSummary, 'paymentMade' | 'creationDate'>,
) => {
  const dateA = a.paymentMade || a.creationDate
  const dateB = b.paymentMade || b.creationDate
  if (dateA.getTime() === dateB.getTime()) return 0
  return dateA.getTime() > dateB.getTime() ? 1 : -1
}
