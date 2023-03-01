import { useQuery } from '@tanstack/react-query'
import shallow from 'zustand/shallow'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { getContractSummaries } from '../../utils/peachAPI'

const getContractSummariesQuery = async () => {
  const [contracts, error] = await getContractSummaries({})

  if (error) throw new Error(error.error)
  return contracts || []
}

export const useContractSummaries = (enabled = true) => {
  const [contracts, setContracts, getLastModified] = useTradeSummaryStore(
    (state) => [state.contracts, state.setContracts, state.getLastModified],
    shallow,
  )
  const { data, isLoading, error, refetch } = useQuery(['contractSummaries'], getContractSummariesQuery, {
    enabled,
    initialData: contracts,
    initialDataUpdatedAt: getLastModified().getTime(),
    onSuccess: (result) => {
      setContracts(result)
    },
  })

  return { contracts: data, isLoading, error, refetch }
}
