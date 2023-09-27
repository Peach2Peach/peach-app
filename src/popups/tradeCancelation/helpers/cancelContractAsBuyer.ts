import { peachAPI } from '../../../utils/peachAPI'
import { getResult } from '../../../utils/result'
import { Result } from '../../../utils/result/types'

type UpdateResult = {
  contract: Contract
}

export const cancelContractAsBuyer = async (contract: Contract): Promise<Result<UpdateResult, string>> => {
  const { result, error: err } = await peachAPI.private.contract.cancelContract({
    contractId: contract.id,
  })

  if (result) return getResult({
    contract: {
      ...contract,
      canceled: true,
      cancelConfirmationDismissed: false,
    },
  })
  return getResult({ contract }, err?.error)
}
