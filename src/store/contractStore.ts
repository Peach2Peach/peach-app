import { createStore, useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { updateArrayItem } from '../utils/array/updateArrayItem'
import { createStorage, toZustandStorage } from '../utils/storage'

const storeId = 'contract-store'

const contractStorage = createStorage(storeId)

type ContractState = {
  contracts: Contract[]
  migrated: boolean
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
  migrated: false,
}

export const contractStore = createStore(
  persist<ContractStore>(
    (set, get) => ({
      ...defaultContractStore,
      reset: () => set(defaultContractStore),
      getContract: (contractId) => get().contracts.find(({ id }) => id === contractId),
      getContracts: () => get().contracts,
      setContract: (contractId, data) => set(() => ({ contracts: updateArrayItem(get().contracts, contractId, data) })),
      setMigrated: () => set(() => ({ migrated: true })),
    }),
    {
      name: storeId,
      version: 0,
      storage: createJSONStorage(() => toZustandStorage(contractStorage)),
    },
  ),
)
export const useContractStore = <T>(
  selector: (state: ContractStore) => T,
  equalityFn?: ((a: T, b: T) => boolean) | undefined,
) => useStore(contractStore, selector, equalityFn)
