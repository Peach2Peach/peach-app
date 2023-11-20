import { cancelContract } from '../../../utils/peachAPI'

export const cancelContractAsBuyer = async (contract: Contract) => {
  const [result, err] = await cancelContract({
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
