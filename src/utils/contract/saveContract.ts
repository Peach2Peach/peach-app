import { useTradeSummaryStore } from './../../store/tradeSummaryStore'
import { getSummaryFromContract } from './getSummaryFromContract'

export const saveContract = (contract: Contract) => {
  useTradeSummaryStore.getState().setContract(contract.id, getSummaryFromContract(contract))
}
