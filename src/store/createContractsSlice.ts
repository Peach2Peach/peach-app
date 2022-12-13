import { StateCreator } from 'zustand'
import { UserDataStore } from '.'
import { patchDisputeAcknowledgements } from '../utils/contract'
import { contractsStorage } from '../utils/storage/contractsStorage'

export type ContractsStore = {
  contracts: Record<Contract['id'], Contract>
  setContract: (contract: Contract) => void
  getContractById: (id: Contract['id']) => Contract
  getContractArray: () => Contract[]
  initializeContracts: () => Promise<unknown>
}

export const createContractsSlice: StateCreator<
  UserDataStore,
  [],
  [['zustand/persist', ContractsStore]],
  ContractsStore
> = (set, get) => ({
  contracts: {},
  initializeContracts: async () => {
    const initialContractData = (await contractsStorage.indexer.maps.getAll()) as Record<string, Contract>
    set((state) => ({ ...state, contracts: initialContractData }))
  },
  setContract: (contract: Contract) =>
    set((state) => {
      const patchedContract = patchDisputeAcknowledgements(get().getContractById(contract.id), contract)
      contractsStorage.setMap(patchedContract.id, patchedContract)
      return { ...state, [patchedContract.id]: patchedContract }
    }),
  getContractArray: () => Object.values(get().contracts),
  getContractById: (id: Contract['id']) => get().contracts[id],
})
