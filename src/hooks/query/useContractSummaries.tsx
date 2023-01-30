import { useQuery } from '@tanstack/react-query'
import { getContractSummaries } from '../../utils/peachAPI'

const getContractSummariesQuery = async () => {
  const [contracts] = await getContractSummaries({})

  return contracts
}

export const useContractSummaries = () => {
  const { data, isLoading, error, refetch } = useQuery(['contractSummaries'], getContractSummariesQuery)

  return { contracts: data, isLoading, error, refetch }
}
