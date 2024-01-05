import { ContractSummary } from '../../../peach-api/src/@types/contract'

export const sortSummariesByDate = (
  a: Pick<TradeSummary, 'creationDate'> & Pick<ContractSummary, 'paymentMade'>,
  b: Pick<TradeSummary, 'creationDate'> & Pick<ContractSummary, 'paymentMade'>,
) => {
  const dateA = a.paymentMade || a.creationDate
  const dateB = b.paymentMade || b.creationDate
  if (dateA.getTime() === dateB.getTime()) return 0
  return dateA.getTime() > dateB.getTime() ? 1 : -1
}
