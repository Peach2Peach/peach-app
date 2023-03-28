import { createStore, useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { updateArrayItem } from '../utils/array/updateArrayItem'
import { createStorage, toZustandStorage } from '../utils/storage'

const id = 'contracts'

const contractStorage = createStorage(id)

type ContractState = {
  contracts: Contract[]
}
export type ContractStore = ContractState & {
  contracts: Contract[]
  reset: () => void
  getContract: (contractId: string) => Contract | undefined
  getContracts: () => Contract[]
  setContract: (contractId: string, data: Partial<Contract>) => void
}

const defaultContractStore: ContractState = {
  contracts: [],
}

export const contractStore = createStore(
  persist<ContractStore>(
    (set, get) => ({
      ...defaultContractStore,
      reset: () => set(defaultContractStore),
      getContract: (contractId) => get().contracts.find(({ id }) => id === contractId),
      getContracts: () => get().contracts,
      setContract: (contractId, data) => set(() => ({ contracts: updateArrayItem(get().contracts, contractId, data) })),
    }),
    {
      name: id,
      version: 0,
      storage: createJSONStorage(() => toZustandStorage(contractStorage)),
    },
  ),
)
export const useContractStore = <T>(
  selector: (state: ContractStore) => T,
  equalityFn?: ((a: T, b: T) => boolean) | undefined,
) => useStore(contractStore, selector, equalityFn)
