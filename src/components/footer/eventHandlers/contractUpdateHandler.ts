import { getContract, saveContract } from '../../../utils/contract'

export const contractUpdateHandler = async (update: ContractUpdate) => {
  const contract = getContract(update.contractId)

  if (!contract) return
  saveContract({
    ...contract,
    [update.event]: new Date(update.data.date),
  })
}
