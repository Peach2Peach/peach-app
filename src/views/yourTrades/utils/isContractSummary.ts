import { ContractSummary } from '../../../../peach-api/src/@types/contract'

export const isContractSummary = (
  trade: Pick<ContractSummary, 'price' | 'currency'> | Partial<OfferSummary>,
): trade is ContractSummary => 'price' in trade && 'currency' in trade
