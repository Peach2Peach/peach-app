import { createStore, useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../utils/storage'

const storeId = 'contractStore'

const contractStorage = createStorage(storeId)

type ContractState = {
  contracts: Record<string, LocalContract>
  migrated: boolean
}
export type ContractStore = ContractState & {
  reset: () => void
  getContract: (contractId: string) => LocalContract | undefined
  getContracts: () => Record<string, LocalContract>
  setContract: (contract: LocalContract) => void
  updateContract: (contractId: string, data: Partial<LocalContract>) => void
}

const defaultContractStore: ContractState = {
  contracts: {},
  migrated: false,
}

export const contractStore = createStore(
  persist<ContractStore>(
    (set, get) => ({
      ...defaultContractStore,
      reset: () => set(defaultContractStore),
      getContract: (contractId) => get().contracts[contractId],
      getContracts: () => get().contracts,
      setContract: (contract) =>
        set(() => ({
          contracts: {
            ...get().contracts,
            [contract.id]: contract,
          },
        })),
      updateContract: (contractId, data) => {
        const contract = get().getContract(contractId)

        if (!contract) return
        get().setContract({
          ...contract,
          ...data,
        })
      },
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
