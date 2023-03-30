import { cancelContract } from '../../../utils/peachAPI'
import { getResult } from '../../../utils/result'

export const cancelContractAsBuyer = async (contract: Contract) => {
  const [result, err] = await cancelContract({
    contractId: contract.id,
  })

  if (result) return getResult({
    contract: {
      ...contract,
      canceled: true,
      cancelConfirmationDismissed: false,
    },
  })
  return getResult({ contract }, err)
}
