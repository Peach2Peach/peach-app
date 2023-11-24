import { peachAPI } from '../../../utils/peachAPI'

export const cancelContractAsBuyer = async (contract: Contract) => {
  const { result, error: err } = await peachAPI.private.contract.cancelContract({
    contractId: contract.id,
  })

  if (result) return {
    result: {
      contract: {
        ...contract,
        canceled: true,
      },
    },
  }
  return { result: { contract }, error: err?.error }
}
