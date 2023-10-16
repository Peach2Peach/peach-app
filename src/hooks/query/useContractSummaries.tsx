import { useQuery } from '@tanstack/react-query'
import { shallow } from 'zustand/shallow'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { getContractSummaries } from '../../utils/peachAPI'

const getContractSummariesQuery = async () => {
  const [contracts, error] = await getContractSummaries({})

  if (error || !contracts) throw new Error(error?.error)
  return contracts
}

export const useContractSummaries = (enabled = true) => {
  const [contracts, setContracts, lastModified] = useTradeSummaryStore(
    (state) => [state.contracts, state.setContracts, state.lastModified],
    shallow,
  )
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['contractSummaries'],
    queryFn: getContractSummariesQuery,
    enabled,
    initialData: contracts.length ? contracts : undefined,
    initialDataUpdatedAt: lastModified.getTime?.(),
    onSuccess: setContracts,
  })

  return { contracts: data || [], isLoading, isFetching, error, refetch }
}
