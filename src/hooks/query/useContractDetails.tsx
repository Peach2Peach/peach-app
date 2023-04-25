import { useIsFocused } from '@react-navigation/native'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from '@tanstack/react-query'
import { useContractStore } from '../../store/contractStore'
import { getContract } from '../../utils/peachAPI'

const getContractQuery = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, contractId] = queryKey
  const [contract] = await getContract({ contractId })

  return contract
}

type ContractDetailsResult = {
  contract?: LocalContract
  isLoading: boolean
  refetch: <T>(
    options?: (RefetchOptions & RefetchQueryFilters<T>) | undefined
  ) => Promise<QueryObserverResult<Contract | null | undefined, unknown>>
  error: unknown
}

export const useContractDetails = (id: string, refetchInterval?: number): ContractDetailsResult => {
  const localContract = useContractStore((state) => state.getContract(id))
  const isFocused = useIsFocused()
  const { data, isLoading, refetch, error } = useQuery(['contract', id], getContractQuery, {
    initialData: localContract,
    initialDataUpdatedAt: localContract?.lastModified?.getTime(),
    refetchInterval,
    enabled: isFocused,
  })

  const contract = data ? { ...localContract, ...data } : localContract

  return { contract, isLoading, refetch, error }
}
