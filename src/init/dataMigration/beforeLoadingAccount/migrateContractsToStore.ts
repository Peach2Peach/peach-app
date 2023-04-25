import { useLocalContractStore } from '../../../store/useLocalContractStore'
import { loadContracts } from '../../../utils/account'
import { contractStorage } from '../../../utils/account/contractStorage'

export const migrateContractsToStore = async () => {
  if (useLocalContractStore.getState().migrated) return
  const contracts = await loadContracts()
  contracts.forEach((contract) => {
    useLocalContractStore.getState().setContract({
      id: contract.id,
      hasSeenDisputeEmailPopup: false,
      error: undefined,
      disputeResultAcknowledged: false,
      cancelConfirmationPending: false,
      cancelConfirmationDismissed: false,
    })
  })
  useLocalContractStore.setState({
    migrated: true,
  })
  contractStorage.clearStore()
}
