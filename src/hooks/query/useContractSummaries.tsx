import { useQuery } from '@tanstack/react-query'
import shallow from 'zustand/shallow'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { error as logError } from '../../utils/log'
import { getContractSummaries } from '../../utils/peachAPI'

const getContractSummariesQuery = async () => {
  const [contracts, error] = await getContractSummaries({})

  if (error) logError(new Error(error.error))
  return contracts || []
}

export const useContractSummaries = () => {
  const [contracts, setContracts, getLastModified] = useTradeSummaryStore(
    (state) => [state.contracts, state.setContracts, state.getLastModified],
    shallow,
  )
  const { data, isLoading, error, refetch } = useQuery(['contractSummaries'], getContractSummariesQuery, {
    initialData: contracts,
    initialDataUpdatedAt: getLastModified().getTime(),
    onSuccess: (result) => {
      setContracts(result)
    },
  })

  return { contracts: data, isLoading, error, refetch }
}
