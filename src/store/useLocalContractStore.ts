import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createStorage } from '../utils/storage'
import { createPersistStorage } from './createPersistStorage'

const storeId = 'localContractStore'

type LocalContractState = {
  contracts: Record<string, LocalContract>
  migrated: boolean
}
export type LocalContractStore = LocalContractState & {
  reset: () => void
  setContract: (contract: LocalContract) => void
  updateContract: (contractId: string, data: Partial<LocalContract>) => void
  setHasSeenDisputeEmailPopup: (contractId: string, hasSeenPopup?: boolean) => void
  migrateContracts: (contracts: Contract[]) => void
  setMigrated: () => void
}
const contractStorage = createStorage(storeId)
const storage = createPersistStorage<LocalContractStore>(contractStorage)

const defaultContractStore: LocalContractState = {
  contracts: {},
  migrated: false,
}

export const useLocalContractStore = create<LocalContractStore>()(
  persist(
    (set, get) => ({
      ...defaultContractStore,
      reset: () => set(defaultContractStore),
      setContract: (contract) =>
        set((state) => ({
          contracts: {
            ...state.contracts,
            [contract.id]: contract,
          },
        })),
      updateContract: (contractId, data) => {
        const contract = get().contracts[contractId]
        set((state) => ({
          contracts: {
            ...state.contracts,
            [contractId]: {
              ...contract,
              ...data,
            },
          },
        }))
      },
      setHasSeenDisputeEmailPopup: (contractId: string, hasSeenPopup = true) => {
        get().updateContract(contractId, {
          hasSeenDisputeEmailPopup: hasSeenPopup,
        })
      },
      migrateContracts: (contracts: Contract[]) => {
        contracts.forEach((contract) => {
          get().setContract({
            id: contract.id,
            hasSeenDisputeEmailPopup: true,
            // @ts-ignore
            error: contract.error,
            // @ts-ignore
            disputeResultAcknowledged: contract.disputeResultAcknowledged,
            // @ts-ignore
            cancelConfirmationPending: contract.cancelConfirmationPending,
            // @ts-ignore
            cancelConfirmationDismissed: contract.cancelConfirmationDismissed,
          })
        })
      },
      setMigrated: () => set(() => ({ migrated: true })),
    }),
    {
      name: storeId,
      version: 0,
      storage,
    },
  ),
)
