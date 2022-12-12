import create from 'zustand'
import { contractsStorage } from './contractsStorage'

export type ContractsStore = {
  contracts: Record<Contract['id'], Contract>
  setContract: (contract: Contract) => void
  get: (id: Contract['id']) => Contract
  iterator: () => Contract[]
  initialize: () => Promise<unknown>
}

export const useContractsStore = create<ContractsStore>()((set, get) => ({
  contracts: {},
  initialize: async () => {
    const initialContractData = (await contractsStorage.indexer.maps.getAll()) as Account['contracts']
    set((state) => ({ ...state, contracts: initialContractData }))
  },
  setContract: (contract: Contract) =>
    set((state) => {
      contractsStorage.setMap(contract.id, contract)
      return { ...state, [contract.id]: contract }
    }),
  iterator: () => Object.values(get().contracts),
  get: (id: Contract['id']) => get().contracts[id],
}))
