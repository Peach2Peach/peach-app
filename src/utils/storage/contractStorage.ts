import create from 'zustand'
import { persist } from 'zustand/middleware'
import { createStorage } from './createStorage'

export const contractStorage = createStorage('contracts')

type ContractStore = {
  contracts: Record<Contract['id'], Contract>
  setContract: (contract: Contract) => void
}

export const useContractStore = create<ContractStore>()(
  persist(
    (set) => ({
      contracts: {},
      setContract: (contract: Contract) => set((state) => ({ ...state, [contract.id!]: contract })),
    }),
    {
      name: 'contract-storage',
      version: 0,
      getStorage: () => contractStorage,
    },
  ),
)
